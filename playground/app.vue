<template>
  <div class="container">
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/zod">
            Zod
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/zod-register">
            Zod Register
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/validation">
            Validation
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <NuxtPage />
  </div>
</template>
