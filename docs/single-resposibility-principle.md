# Single-responsibility Principle (SRP) и Декомпозиция

**Принцип единственной ответственности** — принцип ООП который гласит: "объект должен отвечать только за одну вещь или
делать одну вещь". Принцип применяется не только к объекту, это может быть: функция, класс или переменная.

Принцип — это не закон и его стоит применять в зависимости от того, как изменяется приложение:

* если при изменении кода отвечающего за одну ответственность, затрагивается код отвечающий за другую ответственность,
  то это первый сигнал о нарушении SRP.
* если же изменения касаются только кода отвечающего за одну ответственность, то этот принцип можно не применять.

**Декомпозиция** — разделение целого на части. В нашем случае, это умение делить код на логически составляющие.

Любой код условно можно разделить на составляющие

* получение данных
* обработка данных
* вывод обработанных данных

Любой этап может отсутствовать, но если брать стандартное монолитное микро-сервисное приложение, то это схема будет в
какой-то мере прослеживаться. И самое частое нарушение SRP, это когда несколько пунктов находятся в одном месте,
например: получение и обработка данных или вывод и обработка. Наличие одного из перечисленных случаев говорит об ошибке.

(❌) НЕ ПРАВИЛЬНО

```vue

<template>
  <button @click="addItem">Add Item</button>
</template>

<script>
  export default {
    data() {
      return {
        items: null
      }
    },
    async created() {
      this.items = await new Promise(p => setTimeout(p([1, 2, 3, 4]), 1000))
      this.$watch('items', {
        handler(val) {
          this.$emit('items-changed', val);
        },
        immediate: true
      });
    },
    methods: {
      async addItem() {
        // this.$itemsService.update(this.items) код где обновляем данные по API
        this.items.push(5)
        this.items = await new Promise(p => setTimeout(p([1, 2, 3, 4]), 1000))
        this.$emit('items-changed', this.items);
      }
    }
  }
</script>
```

В данном случае мы воспользовались хуком жизненного цикла, что бы выполнить различные действия: получить данные,
инициализировать переменную, отправить событие, установить слушатель событий и отправить событие. В методе для обработки
клика по кнопке получаем и меняем данные, обновляем по API и отправляем событие. Это нарушает принцип единой
ответственности, затрудняет понимание и усложняет поддержку.

(✅) ПРАВИЛЬНО

```vue

<template>
  <button @click="handleAddItemBtnClick">Add Item</button>
</template>

<script>
  export default {
    data() {
      return {
        items: null
      }
    },
    async created() {
      await this.getItems();
      this.emitItemsChanged();
    },
    watch: {
      items() {
        this.emitItemsChanged()
      }
    },
    methods: {
      /** отправка события */
      emitItemsChanged() {
        if (!this.items) return;
        this.$emit('items-changed', this.items);
      },

      /** получение элементов */
      async getItems() {
        this.items = await new Promise(p => setTimeout(p([1, 2, 3, 4]), 1000))
      },

      /** добавление элемента */
      async addItem() {
        // this.$itemsService.update(this.items) код где обновляем данные по API
        this.items.push(5)
      },

      /** обработка клика по кнопке добавления элемента */
      handleAddItemBtnClick() {
        this.addItem();
        this.getItems();
      }
    }
  }
</script>
```

Разделили код на логические составляющие, теперь если потребуется, можно изменить порядок инициализации, убрать вызов
события, добавить дополнительную логику и в хуке `create` остались только вызовы методов. Это сделал код более очевидным
и логичным, что позволит сократить время рефакторинга и поиска ошибок в будущем.

Подробную информацию можете найти в сети:

- [Принцип единственной ответственности на Wikipedia](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF_%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9_%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8#:~:text=single%2Dresponsibility%20principle%2C%20SRP),%D0%B8%D1%81%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%20%D0%BD%D0%B0%20%D0%BE%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%8D%D1%82%D0%BE%D0%B9%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8.)
- По тегу [Single-responsibility Principle](https://www.google.com/search?q=Single-responsibility+Principle)
