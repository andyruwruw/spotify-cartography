<template>
  <div :class="$style.component">
    <span :class="$style.title">
      Help
    </span>

    <div :class="$style.content">
      <span :class="$style.details">
        {{ details }}
      </span>

      <div :class="$style.notes">
        <note
          v-for="note in notes"
          :key="note.title"
          :title="note.title"
          :description="note.description"
          :icon="note.icon"
          :color="note.color" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { HELP_DETAILS, HELP_NOTES } from '../../config';
import Note from './note.vue';

export default Vue.extend({
  name: 'Help',

  components: {
    Note,
  },

  data: () => ({
    details: HELP_DETAILS,
    notes: HELP_NOTES,
  }),
});
</script>

<style lang="scss" module>
.component {
  width: 100vw;
  height: 100%;
  background-color: #2c2c3de1;
  animation: slide-in 0.3s ease;
  padding: 1rem;
}

.title {
  font-size: 1.2rem;
  font-weight: 300;
}

.content {
  display: flex;
  justify-content: space-between;
  padding-right: 2rem;
  margin-top: 1rem;
}

.details {
  font-weight: 200;
  max-width: 50rem;
  color: rgb(175, 174, 174);
  letter-spacing: 1px;
  font-size: .9rem;
  line-height: 2rem;
  margin-right: 2rem;
}

.notes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  transform: translateY(-2.2rem);
}
</style>
