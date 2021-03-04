<template>
  <div>
    <div v-if="!loggedIn">
      <v-dialog
        v-model="loginShow"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn :dark="isDark" color="white" text v-bind="attrs" v-on="on">
            Log In
          </v-btn>
        </template>
        <v-card color="grey darken-4" dark>
          <v-row>
            <v-col cols="12" sm="8" offset-sm="2" md="6" offset-md="3">
              <v-card-title>
                <v-list-item>
                  <v-list-item-avatar>
                    <img src="/icon.png" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="headline"
                      >Ah, you've been here before.</v-list-item-title
                    >
                    <v-list-item-subtitle>Why not log in?</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-text-field
                        v-model="inputEmail"
                        outlined
                        label="Email"
                        :rules="[rules.required, rules.email]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="inputPassword"
                        outlined
                        label="Password"
                        :rules="[rules.required]"
                        type="password"
                        required
                        @keyup.enter="handleLogin"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" text @click="handleCloseButton">
                  Close
                </v-btn>
                <v-btn color="white" outlined @click="handleLogin">
                  Submit
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="registerShow"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn :dark="isDark" color="white" text v-bind="attrs" v-on="on">
            Register
          </v-btn>
        </template>
        <v-card dark>
          <v-row>
            <v-col cols="12" sm="8" offset-sm="2" md="6" offset-md="3">
              <v-card-title>
                <v-list-item>
                  <v-list-item-avatar>
                    <img src="/icon.png" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="headline"
                      >Is this your first visit to Hedron?</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >Register to start your collection.</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-text-field
                        v-model="inputEmail"
                        label="Email"
                        outlined
                        :rules="[rules.email, rules.required]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="inputPassword"
                        label="Password"
                        outlined
                        type="password"
                        hint="Passwords must be a minimum of eight characters and include at least one upper case letter, one lower case letter, one number, and one symbol (e.g. _-!@#/)"
                        persistent-hint
                        :rules="[rules.passRequired]"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" text @click="handleCloseButton">
                  Close
                </v-btn>
                <v-btn color="white" outlined @click="handleRegister">
                  Submit
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </div>

    <div v-else>
      <v-btn :dark="isDark" color="white" text @click="handleLogout">
        Log Out
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AccountDialogues',
  props: {
    isDark: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      loginShow: false,
      registerShow: false,
      inputEmail: '',
      inputPassword: '',
      rules: {
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid Email.';
        },
        passRequired: (value) =>
          !!value ||
          'Passwords must be a minimum of eight characters and include at least one upper case letter, one lower case letter, one number, and one symbol (e.g. _-!@#/)',
        required: (value) => !!value || 'Required.',
      },
    };
  },
  computed: {
    ...mapState({
      loggedIn: (state) => state.loggedIn,
    }),
  },
  methods: {
    ...mapActions(['logInUser', 'logOutUser', 'registerUser']),
    ...mapActions('collection', ['syncWithDb']),

    handleCloseButton() {
      if (this.loginShow) {
        this.loginShow = false;
      }
      if (this.registerShow) {
        this.registerShow = false;
      }
      this.inputPassword = '';
    },

    async handleLogin() {
      try {
        await this.logInUser({
          email: this.inputEmail,
          password: this.inputPassword,
        });

        this.inputEmail = '';
        this.inputPassword = '';
      } catch (err) {
        console.error('Problem with handleLogin');
        this.inputEmail = '';
        this.inputPassword = '';
      }
    },

    async handleLogout() {
      await this.syncWithDb();
      this.logOutUser();
    },

    async handleRegister() {
      try {
        await this.registerUser({
          email: this.inputEmail,
          password: this.inputPassword,
        });

        this.inputEmail = '';
        this.inputPassword = '';
      } catch (err) {
        console.error('Problem with handleRegister');
        this.inputEmail = '';
        this.inputPassword = '';
      }
    },
  },
};
</script>
