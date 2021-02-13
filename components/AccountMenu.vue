<template>
  <div>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Zareen</v-list-item-title>
            <v-list-item-subtitle>Test Account</v-list-item-subtitle>
          </v-list-item-content>
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
export default {
  name: 'AccountMenu',
  data() {
    return {
      thing: 'value',
    };
  },
};
</script>
