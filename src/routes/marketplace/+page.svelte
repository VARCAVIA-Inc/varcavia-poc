<script lang="ts">
	/* ----------------------------------------------------------
	   Marketplace – Milestone 2B
	---------------------------------------------------------- */
	import { fly, fade } from 'svelte/transition';

	const FLOWISE_URL = 'https://flowise-varcavia-1.onrender.com';
	const FLOW_ID = 'c8fcaccb-ef60-4fbb-b5cc-db474ad8caca';   // ⬅️ sostituisci

	type Message = { role: 'user' | 'assistant'; text: string };

	let messages: Message[] = [
		{ role: 'assistant', text: 'Ciao! Chiedimi pure info sui dataset ✨' }
	];
	let userInput = '';
	let loading = false;

	async function send() {
		const prompt = userInput.trim();
		if (!prompt) return;
		messages = [...messages, { role: 'user', text: prompt }];
		userInput = '';
		loading = true;

		try {
			const res = await fetch(
				`${FLOWISE_URL}/api/v1/prediction/${FLOW_ID}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ question: prompt })
				}
			);
			const data = await res.json();
			const answer = data.text ?? '[errore: risposta vuota]';
			messages = [...messages, { role: 'assistant', text: answer }];
		} catch {
			messages = [
				...messages,
				{ role: 'assistant', text: '❌ Errore di rete verso Flowise' }
			];
		} finally {
			loading = false;
		}
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}

	const datasets = Array.from({ length: 8 }, (_, i) => ({
		id: i + 1,
		title: `Dataset #${i + 1}`,
		desc: 'Descrizione breve del dataset...',
		price: `${(i + 1) * 0.01} ETH`
	}));
</script>

<!-- GRID DATASET -->
<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
	{#each datasets as ds (ds.id)}
		<div
			in:fly={{ y: 20, duration: 300 }}
			class="rounded-2xl shadow-lg bg-white dark:bg-zinc-900 p-4 flex flex-col justify-between"
		>
			<div>
				<h2 class="text-xl font-semibold mb-1">{ds.title}</h2>
				<p class="text-sm text-zinc-500 mb-4">{ds.desc}</p>
			</div>
			<div class="flex items-center justify-between">
				<span class="font-medium">{ds.price}</span>
				<button
					class="px-3 py-1 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700"
				>
					Compra
				</button>
			</div>
		</div>
	{/each}
</div>

<!-- CHAT PANEL -->
<div
	class="fixed right-4 bottom-4 w-full sm:w-96 h-[70vh] sm:h-[80vh] rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 flex flex-col"
	in:fade
>
	<!-- header -->
	<div class="flex items-center justify-between p-4 border-b dark:border-zinc-700">
		<h3 class="font-semibold">Chat VARCAVIA</h3>
		{#if loading}
			<span class="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
		{/if}
	</div>

	<!-- messages -->
	<div class="flex-1 overflow-y-auto p-4 space-y-3">
		{#each messages as m, i (i)}
			<div
				class="max-w-[80%] px-3 py-2 rounded-2xl whitespace-pre-line"
				class:bg-indigo-600={m.role === 'user'}
				class:text-white={m.role === 'user'}
				class:bg-zinc-200={m.role === 'assistant'}
				class:self-end={m.role === 'user'}
			>
				{@html m.text}
			</div>
		{/each}
	</div>

	<!-- input -->
	<form class="p-4 border-t dark:border-zinc-700" on:submit|preventDefault={send}>
		<textarea
			bind:value={userInput}
			on:keydown={handleKey}
			rows="1"
			placeholder="Scrivi un messaggio e premi Enter…"
			class="w-full resize-none rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-zinc-50 dark:bg-zinc-800"
		></textarea>
	</form>
</div>

<style>
	div::-webkit-scrollbar {
		width: 6px;
	}
	div::-webkit-scrollbar-thumb {
		background: theme('colors.indigo.600');
		border-radius: 3px;
	}
</style>
