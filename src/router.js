import { createRouter, createWebHistory } from 'vue-router';
import ParallaxScroll from './components/ParallaxScroll.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import Contact from './components/ContactPage.vue';
import Fashion from './components/FashionTable.vue';
import Secret from './components/SecretPage.vue';
import Login from './components/LoginPage.vue';
import LLMChat from './components/LLMChat.vue';
const routes = [
    {
        path: '',
        name: 'Home',
        component: ParallaxScroll,
    },
    {
        path: '/ParallaxScroll',
        name: 'Parallax',
        component: ParallaxScroll,
    },
    {
        path: '/wheel',
        name: 'Wheel',
        component: MusicPlayer,
    },
    {
        path: '/contact',
        name: 'Contact',
        component: Contact,
    },
    {
        path: '/fashion',
        name: 'Fashion',
        component: Fashion,
    },
    {
        path: '/secret',
        name: 'Secret',
        component: Secret,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/OBXXK5TPNFZA====',
        name: 'riho',
        component: LLMChat
    }
];
const router = createRouter({
    history: createWebHistory('/'),
    routes,
    scrollBehavior() {
        // Always scroll to top when changing routes
        return { top: 0 }
    }
});

export default router;
