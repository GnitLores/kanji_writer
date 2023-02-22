<template>
  <div class="flex flex-wrap">
    <div class="text-white text-opacity-80 font-semibold">
      <div class="inline-block">
        <table class="text-center w-72 border-r-2 border-gray-600 h-full">
          <tr class="border-b border-gray-600">
            <th class="">
              <div class="tooltip">
                Types
                <span class="tooltiptext tooltip-top arrow-bottom"
                  >Types of questions to ask.</span
                >
              </div>
            </th>
            <th>
              <div class="tooltip">
                Show
                <span class="tooltiptext tooltip-top arrow-bottom"
                  >Show this type of test.</span
                >
              </div>
            </th>
            <th>
              <div class="tooltip">
                Priority
                <span class="tooltiptext tooltip-top arrow-bottom"
                  >Relative priority for this type of question.
                  <br />
                  Priority 2 questions are shown twice as often as priority 1.
                </span>
              </div>
            </th>
          </tr>
          <tr>
            <td>
              <div class="tooltip">
                <label class="text-sky-100 font-bold">Kanji</label>
                <span class="tooltiptext tooltip-left arrow-right"
                  >Test individual kanji.
                </span>
              </div>
            </td>
            <td>
              <input
                class=""
                type="checkbox"
                v-model="storeOptions.quizTestKanji"
                @change=""
              />
            </td>
            <td>
              <div class="flex justify-center">
                <AppButton
                  :disabled="storeOptions.quizKanjiPriority <= 1"
                  :text="'-'"
                  class="w-5 h-5 text-xs mr-1 bg-gray-600"
                  @clicked="storeOptions.quizKanjiPriority -= 1"
                />
                <span class="w-5 h-5">{{
                  storeOptions.quizKanjiPriority
                }}</span>
                <AppButton
                  :disabled="storeOptions.quizKanjiPriority >= 20"
                  :text="'+'"
                  class="w-5 h-5 text-xs ml-1 bg-gray-600"
                  @clicked="storeOptions.quizKanjiPriority += 1"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="tooltip">
                <label class="text-sky-100 font-bold">Words</label>
                <span class="tooltiptext tooltip-left arrow-right"
                  >Test words in sentece context.
                </span>
              </div>
            </td>
            <td>
              <input
                class=""
                type="checkbox"
                v-model="storeOptions.quizTestWords"
                @change=""
              />
            </td>
            <td>
              <div class="flex justify-center">
                <AppButton
                  :disabled="storeOptions.quizWordsPriority <= 1"
                  :text="'-'"
                  class="w-5 h-5 text-xs mr-1 bg-gray-600"
                  @clicked="storeOptions.quizWordsPriority -= 1"
                />
                <span class="w-5 h-5">{{
                  storeOptions.quizWordsPriority
                }}</span>
                <AppButton
                  :disabled="storeOptions.quizWordsPriority >= 20"
                  :text="'+'"
                  class="w-5 h-5 text-xs ml-1 bg-gray-600"
                  @clicked="storeOptions.quizWordsPriority += 1"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="tooltip">
                <label class="text-sky-100 font-bold">Similar</label>
                <span class="tooltiptext tooltip-left arrow-right"
                  >Test comparing kanji that have similar components or are
                  easily confused.
                </span>
              </div>
            </td>
            <td>
              <input
                class=""
                type="checkbox"
                v-model="storeOptions.quizTestSimilar"
                @change=""
              />
            </td>
            <td>
              <div class="flex justify-center">
                <AppButton
                  :disabled="storeOptions.quizSimilarPriority <= 1"
                  :text="'-'"
                  class="w-5 h-5 text-xs mr-1 bg-gray-600"
                  @clicked="storeOptions.quizSimilarPriority -= 1"
                />
                <span class="w-5 h-5">{{
                  storeOptions.quizSimilarPriority
                }}</span>
                <AppButton
                  :disabled="storeOptions.quizSimilarPriority >= 20"
                  :text="'+'"
                  class="w-5 h-5 text-xs ml-1 bg-gray-600"
                  @clicked="storeOptions.quizSimilarPriority += 1"
                />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import AppButton from "@/components/AppButton.vue";

const storeOptions = useStoreOptions();
</script>

<style scoped></style>
