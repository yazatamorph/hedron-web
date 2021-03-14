<template>
  <v-card dark>
    <v-card-title>Privacy Policy</v-card-title>
    <v-card-text>
      Hedron's team is committed to collecting as little information about you
      as possible, and what we collect is never sold or shared. Your information
      is only used to provide the app's functionality - nothing more, nothing
      less.
    </v-card-text>
    <v-card-text
      >If you create an account in our archive (available at
      <router-link class="grey--text text--lighten-5" to="/"
        >https://hedronarchive.com</router-link
      >), we collect two kinds of information:</v-card-text
    >
    <v-card-text class="ml-4">
      1. your email address, and
      <br />
      2. data you provide about your card collection.
    </v-card-text>
    <v-card-text
      >We use your email address to allow you to access your account and to
      provide support services. It's never shared or publicly visible, and we'll
      only use it to contact you regarding your account - for example, to
      confirm account creation or to reply to your contact form submissions.
      Likewise, the data you provide about your card collection is not shared.
      We do our best to mitigate the possibility of your data being accessed
      without your authorization by enforcing secure connections with HTTPS and
      WSS, as well as implementing security features like CSP and
      HSTS.</v-card-text
    >
    <v-card-text
      >Hedron doesn't use cookies to provide services. Instead, user identity
      and authentication is handled within the browser using the decentralized
      <a class="grey--text text--lighten-5" href="https://gun.eco/"
        >GUN ecosystem</a
      >
      of tools. Your data is primarily held in your browser using
      <a
        class="grey--text text--lighten-5"
        href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
        >IndexedDB</a
      >, and it's replicated and relayed by the Hedron archive peer for the
      convenience of those who want an app that just works. Our goal is to be a
      completely decentralized, offline-first app, and our code is free and open
      source, so if you prefer to have more fine-grained control of your
      information - or any other aspect of the app! - you're both welcome and
      encouraged to
      <a
        class="grey--text text--lighten-5"
        href="https://github.com/yazatamorph/hedron-web"
        >fork our repository on GitHub</a
      >
      and run your own instances.</v-card-text
    >
    <v-card-subtitle>Legal Disclosures</v-card-subtitle>
    <v-card-text
      >Hedron is hosted and run in the United States. As such, we are bound by
      United States law, which means we may be required to disclose information
      about your account in order to comply with court orders and legal process,
      defend our rights or property, and/or defend the rights or property of
      others. However, we will only disclose the minimum information required
      for compliance, and only after careful review of the request. We'll always
      work to reject requests that are overly broad, vague, or simply unclear.
      In any case when we must disclose your information, we will notify you as
      soon as we're able using the email address you provided during
      registration.</v-card-text
    >
    <v-card-subtitle>Contacting Us</v-card-subtitle>
    <v-card-text
      >If you have questions or concerns regarding this policy or any other site
      content, we encourage you to reach out using our
      <router-link class="grey--text text--lighten-5" to="/contact"
        >contact form</router-link
      >.</v-card-text
    >
  </v-card>
</template>

<script>
export default {
  layout: 'main',
  head() {
    return {
      title: 'Privacy Policy',
    };
  },
};
</script>
