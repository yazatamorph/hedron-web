<template>
  <div>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <div v-if="loggedIn">
              <v-list-item-title>Welcome, Archivist!</v-list-item-title>
              <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
            </div>
            <div v-else>
              <v-list-item-title>Welcome, guest.</v-list-item-title>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <AccountDialogues />
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AccountDialogues from '~/components/AccountDialogues';

export default {
  name: 'AccountMenu',
  components: {
    AccountDialogues,
  },
  data() {
    return {
      thing: 'value',
    };
  },
  computed: {
    ...mapState({
      loggedIn: (state) => state.loggedIn,
      email: (state) => state.user.email,
    }),
  },
};
</script>
