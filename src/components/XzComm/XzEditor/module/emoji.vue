<template>
  <el-carousel :autoplay="false" arrow="never" indicator-position="outside" trigger="click" height="160px">
    <el-carousel-item v-for="(item, j) in emojiData" :key="j">
      <div v-for="(emoji, k) in item" :key="k" @click="addEmoji($event, emoji)">
        <img :src="`https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${emoji[1]}.gif`" :alt="emoji[0]" />
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script lang="ts" setup>
import { EmojiArr } from "./common"
const emit = defineEmits(["pushEmoji"])
const emojiArr = ref(EmojiArr)

const emojiData = computed(() => {
  return splitArr(emojiArr.value, 36)
})

function addEmoji(event, emoji) {
  emit("pushEmoji", event, emoji)
}

function splitArr(array, size) {
  // 获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
  const length = array.length
  // 判断不是数组，或者size没有设置，size小于1，就返回空数组
  if (!length || !size || size < 1) {
    return []
  }
  // 核心部分
  let index = 0 // 用来表示切割元素的范围start
  let resIndex = 0 // 用来递增表示输出数组的下标

  // 根据length和size算出输出数组的长度，并且创建它。
  const result = new Array(Math.ceil(length / size))
  // 进行循环
  while (index < length) {
    // 循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
    result[resIndex++] = array.slice(index, (index += size))
  }
  // 输出新数组
  return result
}
</script>

<style lang="scss" scoped>
:deep(.el-carousel__item) {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  & > div {
    width: 40px;
    height: 40px;
    margin-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: #ececec;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
:deep(.el-carousel__button) {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgb(155, 151, 151);
}
</style>
