<template>
  <div class="flex select-none">
    <div class="w-36 border-2 border-gray-600 p-2 rounded">
      <div
        class="text-white text-opacity-80 font-semibold text-center text-xl mb-1"
      >
        {{
          nSelected === 0 ? "Select kanji to mark" : "Mark selected kanji as:"
        }}
      </div>
      <div class="flex justify-center">
        <div class="tooltip">
          <AppButton
            :disabled="nSelected === 0"
            :text="'Known'"
            class="w-20 text-base h-8 mt-2"
            @clicked="setKnownClicked"
          />

          <span class="tooltiptext tooltip-top arrow-bottom"
            >Indicate that you already know how to write selected kanji
          </span>
        </div>
      </div>

      <AppConfirmationDialog
        ref="knownDialogRef"
        :text="'Set selected kanji as known?'"
        @onConfirm="setKnownConfirmed"
        @onCancel=""
      />

      <div class="flex justify-center">
        <div class="tooltip">
          <AppButton
            :disabled="nSelected === 0"
            :text="'Unknown'"
            class="w-20 text-base h-8 mt-2"
            @clicked="setUnknownClicked"
          />
          <span class="tooltiptext tooltip-bottom arrow-top"
            >Indicate that you have not learned to write selected kanji</span
          >
        </div>
      </div>
      <AppConfirmationDialog
        ref="unknownDialogRef"
        :text="'Set selected kanji as unknown?'"
        @onConfirm="setUnknownConfirmed"
        @onCancel=""
      />
    </div>

    <div
      class="grow flex flex-col ml-4 text-white text-opacity-80 font-semibold"
    >
      <div class="flex justify-start ml-2">
        <p class="text-lg">Options</p>
      </div>
      <div class="grow flex border-2 border-gray-600 rounded">
        <div class="inline-block">
          <table class="text-center w-72 border-r-2 border-gray-600 h-full">
            <tr class="border-b border-gray-600">
              <th class="">Step</th>
              <th>Show</th>
              <th>Repetitions</th>
            </tr>
            <tr>
              <td>
                <label class="text-sky-100 font-bold">Learn</label>
              </td>
              <td>
                <input
                  class=""
                  type="checkbox"
                  v-model="storeOptions.learnShowLearningStep"
                  :disabled="true"
                  @change=""
                />
              </td>
              <td>
                <div class="flex justify-center">
                  <span class="w-5 h-5">{{
                    storeOptions.learnLearningStepRepetitions
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label class="text-sky-100 font-bold">Reinforce</label>
              </td>
              <td>
                <input
                  class=""
                  type="checkbox"
                  v-model="storeOptions.learnShowReinforceStep"
                  @change=""
                />
              </td>
              <td>
                <div class="flex justify-center">
                  <AppButton
                    :disabled="
                      storeOptions.learnReinforcementStepRepetitions <= 1
                    "
                    :text="'-'"
                    class="w-5 h-5 text-xs mr-1 bg-gray-600"
                    @clicked="
                      storeOptions.learnReinforcementStepRepetitions -= 1
                    "
                  />
                  <span class="w-5 h-5">{{
                    storeOptions.learnReinforcementStepRepetitions
                  }}</span>
                  <AppButton
                    :disabled="
                      storeOptions.learnReinforcementStepRepetitions >= 5
                    "
                    :text="'+'"
                    class="w-5 h-5 text-xs ml-1 bg-gray-600"
                    @clicked="
                      storeOptions.learnReinforcementStepRepetitions += 1
                    "
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label class="text-sky-100 font-bold">Quiz</label>
              </td>
              <td>
                <input
                  class=""
                  type="checkbox"
                  v-model="storeOptions.learnShowQuizStep"
                  @change=""
                />
              </td>
              <td>
                <div class="flex justify-center">
                  <AppButton
                    :disabled="storeOptions.learnQuizStepRepetitions <= 1"
                    :text="'-'"
                    class="w-5 h-5 text-xs mr-1 bg-gray-600"
                    @clicked="storeOptions.learnQuizStepRepetitions -= 1"
                  />
                  <span class="w-5 h-5">{{
                    storeOptions.learnQuizStepRepetitions
                  }}</span>
                  <AppButton
                    :disabled="storeOptions.learnQuizStepRepetitions >= 5"
                    :text="'+'"
                    class="w-5 h-5 text-xs ml-1 bg-gray-600"
                    @clicked="storeOptions.learnQuizStepRepetitions += 1"
                  />
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="w-60 inline-block border-r-2 border-gray-600 pt-2">
          <div class="flex mx-2">
            <span class="">Batch size (kanji):</span>
            <span class="grow"></span>
            <AppButton
              :disabled="storeOptions.learnBatchSize <= 0"
              :text="'-'"
              class="w-5 h-5 text-xs mr-1 ml-2 bg-gray-600"
              @clicked="storeOptions.learnBatchSize -= 1"
            />
            <span class="w-fit h-5 text-center">{{
              storeOptions.learnBatchSize
            }}</span>
            <AppButton
              :disabled="storeOptions.learnBatchSize >= 20"
              :text="'+'"
              class="w-5 h-5 text-xs ml-1 bg-gray-600"
              @clicked="storeOptions.learnBatchSize += 1"
            />
          </div>
          <div class="flex mx-2">
            <span class="">Review delay (mins):</span>
            <span class="grow"></span>
            <AppButton
              :disabled="storeOptions.learnReviewDelay <= 0"
              :text="'-'"
              class="w-5 h-5 text-xs mr-1 ml-2 bg-gray-600"
              @clicked="storeOptions.learnReviewDelay -= 1"
            />
            <span class="w-fit h-5 text-center">{{
              storeOptions.learnReviewDelay
            }}</span>
            <AppButton
              :disabled="storeOptions.learnReviewDelay >= 15"
              :text="'+'"
              class="w-5 h-5 text-xs ml-1 bg-gray-600"
              @clicked="storeOptions.learnReviewDelay += 1"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-end pt-1">
        <p class="text-xl">
          {{
            nSelected === 0
              ? "Select kanji to start learning"
              : "Start learning selected kanji:"
          }}
        </p>
        <div class="tooltip">
          <AppButton
            :disabled="nSelected === 0"
            :text="'Start'"
            class="w-24 h-8 text-lg ml-4"
            @clicked="startLearnClicked"
          />
          <span class="tooltiptext tooltip-bottom arrow-top"
            >Start learning quiz using all selected kanji and current settings.
            Learning a kanji will mark it as known.</span
          >
        </div>
        <AppConfirmationDialog
          ref="startDialogRef"
          :text="'Start learning using current settings?'"
          @onConfirm="startLearnConfirmed"
          @onCancel=""
        />
      </div>
    </div>
  </div>

  <div
    class="flex justify-center text-white text-opacity-80 font-semibold mx-2 mt-8"
  >
    <p class="">
      Click, click-and-drag, or right click controls below to select kanji to
      learn.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreUser } from "@/stores/storeUser";
import { useSelection } from "@/use/useSelection";
import AppButton from "@/components/AppButton.vue";
import AppConfirmationDialog from "@/components/Modals/AppConfirmationDialog.vue";

const storeOptions = useStoreOptions();
const storeUser = useStoreUser();

const { selected, initSelected } = useSelection();

const knownDialogRef = ref(null);
const unknownDialogRef = ref(null);
const startDialogRef = ref(null);

const setKnownClicked = () => {
  knownDialogRef.value.showDialog();
};

const setKnownConfirmed = () => {
  storeUser.setSelectionAsKnown(selected.value, true);
  initSelected();
};

const setUnknownClicked = () => {
  unknownDialogRef.value.showDialog();
};

const setUnknownConfirmed = () => {
  storeUser.setSelectionAsKnown(selected.value, false);
  initSelected();
};

const startLearnClicked = () => {
  startDialogRef.value.showDialog();
};

const startLearnConfirmed = () => {};

const nSelected = computed(() => selected.value.filter(Boolean).length);
const nKnown = computed(() => storeUser.known.filter(Boolean).length);
</script>

<style scoped></style>
