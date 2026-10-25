<template>
  <UHeader
    class="xara-docs-header"
    title="Documentation navigation"
    :menu="{ title: 'Documentation navigation', description: 'Browse Xara API guides and reference pages.' }"
    :toggle="{ class: 'size-11 justify-center' }"
    :ui="{ center: 'flex-1', right: 'gap-0.5 lg:gap-1.5', body: 'flex flex-col gap-6' }"
  >
    <AppHeaderCenter />

    <template #left>
      <AppHeaderLeft />
    </template>

    <template #right>
      <div class="xara-header-desktop">
        <AppHeaderCTA />
      </div>
      <UContentSearchButton class="size-11 justify-center lg:hidden" />
      <div class="xara-header-desktop">
        <ClientOnly>
          <UColorModeButton class="size-11 justify-center" />
          <template #fallback>
            <span class="size-11" aria-hidden="true" />
          </template>
        </ClientOnly>
      </div>
    </template>

    <template #body>
      <AppHeaderBody />
      <div class="border-t border-default pt-5 pb-4">
        <div class="mb-4 flex items-center justify-between text-sm text-toned">
          <span>Appearance</span>
          <ClientOnly>
            <UColorModeButton class="size-11 justify-center" />
          </ClientOnly>
        </div>
        <AppHeaderCTA class="w-full min-h-11" />
      </div>
    </template>
  </UHeader>
</template>
