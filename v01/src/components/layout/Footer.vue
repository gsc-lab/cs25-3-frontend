<template>
  <footer class="footer">
    <div class="inner">
      <!-- 브랜드 -->
      <div class="hero">
        <h2 class="brand">HAIR SALON KIMHADHIII</h2>
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
const address = ['35 Bokhyeon-ro', 'Buk-gu, Daegu', '41527']

const hours = ['Mon–Fri: 10:00 – 19:00', 'Sat: 10:00 – 17:00', 'Sun: Closed']

const phone = '+82)010-4819-7975'
const email = 'skkhc0317@g.yju.ac.kr'
</script>

<style scoped>
.footer {
  margin-top: 4rem;
  background-color: #eae4e0;
  padding: 3rem 1.5rem 2.5rem;
}

.inner {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}

/* 브랜드 영역 */
.hero {
  margin-bottom: 2.5rem;
}

.brand {
  font-family: 'Times New Roman', Georgia, serif;
  font-size: 2rem;
  letter-spacing: 0.08em;
  margin-bottom: 0.3rem;
}

.tagline {
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #555555;
}

/* 하단 3열 */
.cols {
  display: flex;
  justify-content: space-between;
  gap: 2.5rem;
  padding-top: 1.8rem;
  border-top: 1px solid #d4cfca;
}

.col {
  flex: 1;
}

.col h3 {
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}

.txt {
  font-size: 0.8rem;
  line-height: 1.7;
  color: #555555;
}

.txt a {
  display: block;
  text-decoration: none;
  color: #555555;
}

.txt a:hover {
  text-decoration: underline;
}

/* -- 반응형 -- */
@media (max-width: 900px) {
  .cols {
    gap: 1.5rem;
  }
}

@media (max-width: 720px) {
  .footer {
    padding: 2.5rem 1.25rem 2rem;
  }

  .cols {
    flex-direction: column;
    align-items: center;
  }

  .col {
    text-align: center;
  }
}
</style>
