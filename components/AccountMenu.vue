<template>
  <div>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Zareen</v-list-item-title>
            <v-list-item-subtitle>Test Account</v-list-item-subtitle>
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
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text> Sign Out </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AccountMenu',
  data() {
    return {
      thing: 'value',
    };
  },
  computed: {
    ...mapState('collection', {
      isSynchronizing: (state) => state.synchronizing,
    }),
  },
  methods: {
    ...mapActions('collection', ['syncWithDb']),

    handleSync() {
      this.syncWithDb();
    },
  },
};
</script>
