<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div
          class="d-flex flex-wrap flex-md-nowrap justify-space-around justify-md-center"
        >
          <v-img
            class="elevation-18 rounded-card mr-md-n3"
            max-width="300px"
            src="https://c1.scryfall.com/file/scryfall-cards/png/front/c/c/cca8eb95-d071-46a4-885c-3da25b401806.png?1562441143"
          ></v-img>
          <v-sheet
            min-width="300px"
            max-width="600px"
            class="elevation-6 mt-md-n4 mr-sm-2 ml-md-n2 pt-md-4 pl-md-6 rounded-tl-xl"
          >
            <v-card-title class="heading">Card Name</v-card-title>
            <v-card-text>
              I've got a lovely bunch of coconuts, here they are all standing in
              a row. Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got
              a lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate.
            </v-card-text>
          </v-sheet>

          <v-sheet
            min-width="300px"
            max-width="350"
            class="elevation-6 mt-md-n4 pt-md-4 rounded-br-xl"
          >
            <v-card-title class="heading">Printings!</v-card-title>
            <v-card-text>
              I've got a lovely bunch of coconuts, here they are all standing in
              a row. Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got
              a lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate. I've got a
              lovely bunch of coconuts, here they are all standing in a row.
              Lorem ipsum lasciate ogne speranza voi ch'intrate.
            </v-card-text>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CardDetails',
};
</script>

<style scoped>
.rounded-card {
  border-radius: 4.75% / 3.5%;
}
</style>
