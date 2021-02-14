<template>
  <div>
    <v-list-item>
      <v-list-item-subtitle>Keep Synchronized</v-list-item-subtitle>
      <v-list-item-action>
        <v-switch
          :input-value="autoSync"
          inset
          color="teal accent-2"
          @change="handleAutoSyncToggle"
        ></v-switch>
      </v-list-item-action>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle>Sync Now</v-list-item-subtitle>
      <v-list-item-action>
        <v-btn
          :loading="isSynchronizing"
          :disabled="isSynchronizing"
          icon
          @click="handleSync"
        >
          <v-icon>mdi-sync</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'SyncSettings',
  computed: {
    ...mapState('collection', {
      autoSync: (state) => state.autoSync,
      isSynchronizing: (state) => state.synchronizing,
    }),
  },
  methods: {
    ...mapActions('collection', ['changeAutoSync', 'syncWithDb']),

    handleAutoSyncToggle() {
      this.changeAutoSync(!this.autoSync);
    },

    handleSync() {
      this.syncWithDb();
    },
  },
};
</script>
