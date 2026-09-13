<script setup lang="ts">
import type { DocsCollectionItem } from '@nuxt/content'
import { getApiExample } from '~/data/api-examples'

const props = defineProps<{
  page?: DocsCollectionItem | null
}>()

const route = useRoute()
const example = computed(() => getApiExample(route.path))
const links = computed(() => props.page?.body?.toc?.links || [])
const appConfig = useAppConfig()
const { t } = useDocusI18n()
const contentTocVariants = useUIConfig('contentToc')
</script>

<template>
  <div>
    <ApiExamplePanel v-if="example" :example="example" />

    <UContentToc
      v-else-if="links.length"
      :highlight="contentTocVariants.highlight ?? true"
      :highlight-color="contentTocVariants.highlightColor"
      :highlight-variant="contentTocVariants.highlightVariant ?? 'circuit'"
      :color="contentTocVariants.color"
      :title="appConfig.toc?.title || t('docs.toc')"
      :links="links"
    >
      <template #bottom>
        <DocsAsideRightBottom />
      </template>
    </UContentToc>

    <DocsAsideMobileBar v-if="!example" :links="links" />
  </div>
</template>
