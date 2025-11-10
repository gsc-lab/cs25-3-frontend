<template>
  <footer class="footer">
    <div class="inner">
      <!-- 브랜드 -->
      <div class="hero">
        <h2 class="brand">kimhadiii Salon</h2>
        <p class="tagline">Hairdressers & Colourists</p>
      </div>

      <!-- 3열 정보 -->
      <div class="cols">
        <section class="col">
          <h3>Address</h3>
          <div class="txt">
            <div v-for="(line, i) in address" :key="i">{{ line }}</div>
          </div>
        </section>

        <section class="col">
          <h3>Opening hours</h3>
          <div class="txt">
            <div v-for="(line, i) in hours" :key="i">{{ line }}</div>
          </div>
        </section>

        <section class="col">
          <h3>Contact</h3>
          <div class="txt">
            <a :href="`tel:${phone}`">{{ phone }}</a>
            <a :href="`mailto:${email}`">{{ email }}</a>
          </div>
        </section>
      </div>
    </div>
  </footer>
</template>

<script setup>
const address = [
  '35 Bokhyeon-ro',
  'Buk-gu, Daegu',
  '41527'
]

const hours = [
  'Mon–Fri: 10:00 – 19:00',
  'Sat: 10:00 – 17:00',
  'Sun: Closed'
]

const phone = '+82)010-4819-7975'
const email = 'skkhc0317@g.yju.ac.kr'

</script>