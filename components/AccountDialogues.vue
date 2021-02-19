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
        <v-card>
          <v-card-title>
            <span class="headline">Log In</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="inputEmail"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="inputPassword"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="loginShow = false">
              Close
            </v-btn>
            <v-btn color="secondary" outlined @click="handleLogin">
              Submit
            </v-btn>
          </v-card-actions>
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
        <v-card>
          <v-card-title>
            <span class="headline">Register</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="inputEmail"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="inputPassword"
                    label="Password"
                    type="password"
                    hint="Passwords must be eight or more characters in length and include at least one upper case letter, one lower case letter, one number, and one symbol (e.g. _!@#/)"
                    persistent-hint
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="registerShow = false">
              Close
            </v-btn>
            <v-btn color="secondary" outlined @click="handleRegister">
              Submit
            </v-btn>
          </v-card-actions>
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
