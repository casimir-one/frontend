# Основные принципы и соглашения используемые в проекте

## Single-responsibility Principle (SRP)

**Принцип единственной ответственности** — принцип ООП который гласит: "объект должен отвечать только за одну вещь или делать одну вещь". Объект — это функция, переменная, класс, что угодно.

Принцип — это не закон и его стоит применять в зависимости от того, как изменяется приложение:
* если при изменении кода отвечающего за одну ответственность, затрагивается код отвечающий за другую ответственность, то это первый сигнал о нарушении SRP.
* если же изменения касаются только кода отвечающего за одну ответственность, то этот принцип можно не применять.


## Декомпозиция

**Декомпозиция** — разделение целого на части. В нашем случае, это умение делить код на логически составляющие.

Любой код условно можно разделить на составляющие

* получение данных
* обработка данных
* вывод обработанных данных

Любой этап может отсутствовать, но если брать стандартное монолитное микро-сервисное приложение, то это схема будет в какой-то мере прослеживаться.
И самое частое нарушение SRP, это когда несколько пунктов находятся в одном месте, например: получение и обработка данных или вывод и обработка. Наличие одного из перечисленных случаев говорит об ошибке.

Подробную информацию можете найти в сети по тегам:
[Single-responsibility Principle](https://www.google.com/search?q=Single-responsibility+Principle),
[SRP](https://www.google.com/search?q=SRP),
[Принцип единственной ответственности](https://www.google.com/search?q=%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF+%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9+%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8&ei=lz95Ycv8G-WvrgSHg7ugAg&ved=0ahUKEwiLpNPUxerzAhXll4sKHYfBDiQQ4dUDCA4&uact=5&oq=%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF+%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9+%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEOgQIABANSgQIQRgAUOqFBVixkwVguJkFaAFwAngAgAGiAYgBigKSAQMwLjKYAQCgAQKgAQHAAQE&sclient=gws-wiz)


## Соглашения

1. [styleguide по markdown](https://arcticicestudio.github.io/styleguide-markdown/)
2. **именование методов и функций**
  происходит по схеме `function [action][triger][event] () { ... }`, пример:

  ```vue
  <template>
    <button @click="handleAddItemBtnClick">Add Item</button>
  </template>
  <script>
    export default {
      methods: {
        handleAddItemBtnClick() {
          // do something
        }
      }
    }
  </script>
  ```
3. **один метод - одно действие (группировка действий)**

  ```vue

<template>
  <button @click="handleAddItemBtnClick">Add Item</button>
</template>
<script>
  export default {
    methods: {
      /** получение списка элементов по API */
      fetchItems() {},

      /** добавление элемента */
      addItem() {},

      /** обработка клика по кнопке добавления элемента */
      handleAddItemBtnClick() {
        this.addItem();
        this.fetchItems();
      }
    }
  }
</script>
  ```
