<template>
  <div>
    <v-hover open-delay="150" close-delay="150">
      <template v-slot:default="{ hover }">
        <div v-if="imageSource && imageSource.length > 1">
          <v-btn
            class="ma-2"
            elevation="26"
            fab
            dark
            absolute
            :class="hover ? `fabHoverOn` : `fabHoverOff`"
            @click="flip = !flip"
            ><v-icon>{{ icon.rotateLeft }}</v-icon></v-btn
          >
          <nuxt-link v-if="linkDest" :to="linkDest">
            <v-slide-x-reverse-transition mode="out-in">
              <v-img
                :key="flip ? imageSource[1] : imageSource[0]"
                class="rounded-card transition-swing"
                :class="`elevation-${hover ? 24 : 10}`"
                :src="flip ? imageSource[1] : imageSource[0]"
                :alt="altText"
              >
              </v-img>
            </v-slide-x-reverse-transition>
          </nuxt-link>
          <v-slide-x-reverse-transition v-else mode="out-in">
            <v-img
              :key="flip ? imageSource[1] : imageSource[0]"
              class="rounded-card transition-swing"
              :class="`elevation-${hover ? 24 : 10}`"
              :src="flip ? imageSource[1] : imageSource[0]"
              :alt="altText"
            >
            </v-img>
          </v-slide-x-reverse-transition>
        </div>
        <div v-else>
          <nuxt-link v-if="linkDest" :to="linkDest">
            <v-img
              class="rounded-card transition-swing"
              :class="`elevation-${hover ? 24 : 10}`"
              :src="imageSource[0]"
              :alt="altText"
            ></v-img>
          </nuxt-link>
          <v-img
            v-else
            class="rounded-card transition-swing"
            :class="`elevation-${hover ? 24 : 10}`"
            :src="imageSource[0]"
            :alt="altText"
          ></v-img>
        </div>
      </template>
    </v-hover>
  </div>
</template>

<script>
import { mdiRotateLeft } from '@mdi/js';
export default {
  name: 'CardImage',
  props: {
    imageSource: {
      type: Array,
      required: true,
      default() {
        return '';
      },
    },
    altText: { type: String, required: true, default: '' },
    linkDest: { type: String, required: false, default: '' },
  },
  data() {
    return {
      icon: {
        rotateLeft: mdiRotateLeft,
      },
      flip: false,
    };
  },
};
</script>

<style scoped>
.rounded-card {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 4.75% / 3.5%;
}

.fabHoverOff {
  opacity: 50%;
}

.fabHoverOn {
  opacity: 95%;
}
</style>
