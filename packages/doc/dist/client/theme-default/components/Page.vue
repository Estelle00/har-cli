<template>
  <main class="page">
    <div class="container">
      <slot name="top" />
      <doc-content class="content" />
      <slot name="bottom" />
    </div>
  </main>
</template>
