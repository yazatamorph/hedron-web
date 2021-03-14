<template>
  <v-card dark>
    <v-card-title>Contact</v-card-title>
    <v-card-text>
      Want to get in touch? We'd love to hear from you - just fill out the form
      below, and we'll do our best to get back to you ASAP!<br /><br />If you've
      discovered a bug, have a suggestion, or want to help with development, we
      also encourage you to drop by our repository on
      <a
        class="grey--text text--lighten-5"
        href="https://github.com/yazatamorph/hedron-web"
        >GitHub</a
      >.
    </v-card-text>
    <v-container>
      <v-row class="justify-space-around">
        <v-col md="10">
          <v-form ref="contactForm">
            <v-text-field
              v-model="contact.email"
              label="Email"
              :rules="[rules.email, rules.requiredEmail]"
              :disabled="sending"
              outlined
              clearable
            ></v-text-field>
            <v-textarea
              v-model="contact.message"
              label="Message"
              :rules="[rules.requiredMessage]"
              :disabled="sending"
              outlined
              clearable
            ></v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text :disabled="sending" @click="handleClear"
                >Clear</v-btn
              >
              <v-btn
                color="white"
                outlined
                :loading="sending"
                :disabled="sending"
                @click="handleSubmit"
                >Submit</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="successAlert" timeout="3000">
      Thanks for your message! We'll reply soon!
      <template v-slot:action="{ attrs }">
        <v-btn color="green" text v-bind="attrs" @click="successAlert = false">
          Ok!
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="failAlert" timeout="3000">
      Something went wrong sending your message. Please try again in a moment!
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="failAlert = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  layout: 'main',
  data() {
    return {
      contact: {
        email: '',
        message: '',
      },
      failAlert: false,
      successAlert: false,
      sending: false,
      rules: {
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'We need a valid email to reply!';
        },
        requiredEmail: (value) => !!value || 'We need a valid email to reply!',
        requiredMessage: (value) =>
          !!value ||
          'Please write your message here. Empty mail is not fun. :(',
      },
    };
  },
  methods: {
    handleClear() {
      this.contact.email = '';
      this.contact.message = '';
      this.$refs.contactForm.reset();
      this.sending = false;
    },
    async handleSubmit() {
      try {
        this.sending = true;

        await this.$axios.$post('https://hedronarchive.com/api/contact/form', {
          email: this.contact.email,
          message: this.contact.message,
        });

        this.successAlert = true;
        this.contact.email = '';
        this.contact.message = '';
        this.$refs.contactForm.reset();
        this.sending = false;
      } catch (err) {
        this.failAlert = true;
        this.sending = false;
      }
    },
  },
  head() {
    return {
      title: 'Contact',
    };
  },
};
</script>
