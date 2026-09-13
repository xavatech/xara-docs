<script setup lang="ts">
import type { ApiExample } from '~/data/api-examples'

const props = defineProps<{
  example: ApiExample
}>()

const mode = ref<'request' | 'response'>('request')
const activeRequest = ref(0)
const activeResponse = ref(0)
const copied = ref(false)

const methodClass = computed(() => {
  if (props.example.method === 'GET') return 'text-[#75b7ff] bg-[#183451]'
  if (props.example.method === 'WEBHOOK') return 'text-[#d6b4ff] bg-[#35234c]'
  return 'text-[#77e0ae] bg-[#183b2b]'
})

const activeCode = computed(() => {
  return mode.value === 'request'
    ? props.example.requests[activeRequest.value]?.code || ''
    : props.example.responses[activeResponse.value]?.code || ''
})

watch(() => props.example.path, () => {
  mode.value = 'request'
  activeRequest.value = 0
  activeResponse.value = 0
})

async function copyCode() {
  if (!import.meta.client) return
  await navigator.clipboard.writeText(activeCode.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <aside class="xara-api-panel" aria-label="Request and response example">
    <div class="border-b border-white/8 px-4 pb-4 pt-4">
      <p v-if="example.eyebrow" class="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#8ba096]">
        {{ example.eyebrow }}
      </p>
      <div class="flex min-w-0 items-center gap-2">
        <span
          class="shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.08em]"
          :class="methodClass"
        >
          {{ example.method }}
        </span>
        <code class="min-w-0 truncate text-[12px] text-[#e6f1eb]">{{ example.path }}</code>
      </div>
      <p class="mt-3 text-xs leading-5 text-[#91a59b]">{{ example.summary }}</p>
    </div>

    <div class="flex items-center justify-between border-b border-white/8 px-3 pt-2">
      <div class="flex gap-1" role="tablist" aria-label="Example type">
        <button
          v-for="item in ['request', 'response'] as const"
          :key="item"
          type="button"
          role="tab"
          :aria-selected="mode === item"
          class="relative px-2.5 py-2.5 text-xs font-medium capitalize transition-colors"
          :class="mode === item ? 'text-white after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[#47bd90]' : 'text-[#7e9188] hover:text-[#bdcbc4]'"
          @click="mode = item"
        >
          {{ item }}
        </button>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-[#91a59b] transition hover:bg-white/6 hover:text-white"
        :aria-label="copied ? 'Code copied' : 'Copy code'"
        @click="copyCode"
      >
        <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3.5" />
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>

    <div class="flex min-h-10 items-center gap-1 overflow-x-auto border-b border-white/8 px-3">
      <template v-if="mode === 'request'">
        <button
          v-for="(request, index) in example.requests"
          :key="request.label"
          type="button"
          class="whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium transition-colors"
          :class="activeRequest === index ? 'bg-white/8 text-white' : 'text-[#71847b] hover:text-[#bdcbc4]'"
          @click="activeRequest = index"
        >
          {{ request.label }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="(response, index) in example.responses"
          :key="response.label"
          type="button"
          class="whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium transition-colors"
          :class="activeResponse === index ? 'bg-white/8 text-white' : 'text-[#71847b] hover:text-[#bdcbc4]'"
          @click="activeResponse = index"
        >
          {{ response.label }}
        </button>
        <span class="ml-auto whitespace-nowrap text-[10px] text-[#6e8278]">
          {{ example.responses[activeResponse]?.status }}
        </span>
      </template>
    </div>

    <pre><code>{{ activeCode }}</code></pre>

    <div class="flex items-center gap-2 border-t border-white/8 bg-white/[0.025] px-4 py-3 text-[10px] text-[#71847b]">
      <span class="size-1.5 rounded-full bg-[#47bd90]" />
      Example only · requests are not sent from this documentation
    </div>
  </aside>
</template>
