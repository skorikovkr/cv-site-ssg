<script setup>
import { ref } from 'vue';


const projects = ref([
    {
        title: 'Blog',
        about: 'My personal blog. This is my first attempt in SSR.',
        sources: [
            {
                'link': 'https://github.com/skorikovkr/blog-frontend',
                'linkTitle': 'Source (frontend)'
            },
            {
                'link': 'https://github.com/skorikovkr/blog-backend',
                'linkTitle': 'Source (backend)'
            }
        ],
        tags: ['Nuxt', 'Laravel', 'Tailwind', 'PrimeVue', 'Pinia', 'MySQL'],
        imageSrc: '/images/project-blog.png'
    },
    {
        title: 'CRM system',
        about: 'Graduation work. CRM system for furniture factory.',
        sources: [
            {
                'link': 'https://github.com/skorikovkr/crm-frontend',
                'linkTitle': 'Source (frontend)'
            },
            {
                'link': 'https://github.com/skorikovkr/crm-backend',
                'linkTitle': 'Source (backend)'
            }
        ],
        tags: ['Nuxt', 'Pinia', 'MySQL', 'Laravel', 'Tailwind', 'PrimeVue'],
        imageSrc: '/images/project-crm.png'
    },
    {
        title: 'Color correction app',
        about: 'Color correction web application for images.',
        sources: [
            {
                'link': 'https://github.com/skorikovkr/crm-frontend',
                'linkTitle': 'Source'
            },
            {
                'link': '/color-correction',
                'useRouterLink': true,
                'linkTitle': 'Watch'
            }
        ],
        tags: ['Tailwind', 'Vue'],
        imageSrc: '/images/project-color-corr.png'
    },
    {
        title: 'This site',
        about: 'My site prerendered with SSG (static site generation).',
        sources: [
            {
                'link': 'https://github.com/skorikovkr/cv-site-ssg',
                'linkTitle': 'Source'
            }
        ],
        tags: ['Tailwind', 'Vue', 'PrimeVue', 'Vite-SSG'],
        imageSrc: '/images/project-cv.png'
    }
])

</script>

<template>
    <section class="my-projects">
        <h2 class="text-3xl font-semibold mb-5">My projects</h2>
        <ul>
            <li v-for="p in projects" :key="p.title" class="my-projects__item mb-4">
                <article class="md:grid grid-cols-2 md:items-center">
                    <div class="my-projects__text">
                        <h3 class="text-2xl font-semibold mb-2">{{ p.title }}</h3>
                        <p class="mb-1">{{ p.about }}</p>
                        <p class="reference mb-3 italic underline">
                            <template v-for="s in p.sources" :key="s.link">
                                <RouterLink v-if="s.useRouterLink" :to="s.link">{{ s.linkTitle }}</RouterLink>
                                <a v-else target="_blank" class="mr-2" :href="s.link">{{
                                    s.linkTitle
                                    }}</a>
                            </template>
                        </p>
                        <p class="tags mb-4">
                            <span class="tag mr-2 bg-primary text-primary-contrast px-1 pb-1 rounded-md"
                                v-for="t in p.tags" :key="t">{{ t
                                }}</span>
                        </p>
                    </div>
                    <div class="my-projects__image justify-self-end">
                        <img :src="p.imageSrc" :alt="p.title" class="rounded-md shadow-md max-h-60" />
                    </div>
                </article>
            </li>
        </ul>
    </section>
</template>