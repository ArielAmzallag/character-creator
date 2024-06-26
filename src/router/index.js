import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../pages/MainPage.vue';
import ErrorPage from '../pages/ErrorPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import SignInPage from '../pages/SignInPage.vue';
import FeedPage from '../pages/FeedPage.vue';
import VerifyMail from '../pages/VerifyMail.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import CharacterCreatorPage from '../pages/CharacterCreatorPage.vue';
import CompendiumPage from '../pages/CompendiumPage.vue';
import PublicCharactersPage from '../pages/PublicCharactersPage.vue';
import PasswordResetForm from '../pages/PasswordResetForm.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: ErrorPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignInPage
  },
  {
    path: '/feed',
    name: 'Feed',
    component: FeedPage,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/verify-email',
    name: 'Verification',
    component: VerifyMail
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/character-creator',
    name: 'CharacterCreator',
    component: CharacterCreatorPage
  },
  {
    path: '/compendium',
    name: 'Compendium',
    component: CompendiumPage
  },
  {
    path: '/public-characters',
    name: 'PublicCharacters',
    component: PublicCharactersPage
  },
  { path: '/password-reset', 
  name: 'PasswordReset',
  component: PasswordResetForm },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const getCurrentUser = () => {
  return new Promise ((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert("You do not have access");
      next("/");
    }
  } else {
    next();
  }
});

export default router
