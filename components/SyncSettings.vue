<template>
  <div>
    <v-list-item to="/collection">
      <v-list-item-content>
        <v-list-item-title>Collection</v-list-item-title>
      </v-list-item-content>

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
    <v-list-item>
      <v-list-item-action>
        <v-switch
          :input-value="autoSync"
          color="teal accent-4"
          @change="handleAutoSyncToggle"
        ></v-switch>
      </v-list-item-action>
      <v-list-item-subtitle>Keep Synchronized</v-list-item-subtitle>
    </v-list-item>

    <v-divider></v-divider>
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
