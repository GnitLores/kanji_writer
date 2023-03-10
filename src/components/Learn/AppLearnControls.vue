<template>
  <div>
    <AppLearnHeader @quickStart="quickStart()" />

    <div class="flex select-none mt-8">
      <AppMarkControls />

      <div
        class="grow flex flex-col ml-4 text-white text-opacity-80 font-semibold"
      >
        <div class="flex ml-2">
          <p class="text-lg">Options</p>
          <div class="grow"></div>
          <div class="tooltip">
            <AppButton
              :text="'Reset Options'"
              class="w-28"
              @clicked="resetClicked"
            />
            <span class="tooltiptext tooltip-left arrow-right"
              >Reset to default settings</span
            >
          </div>
          <AppConfirmationDialog
            ref="resetDialogRef"
            :text="'Reset to default learning quiz settings?'"
            @onConfirm="resetConfirmed"
            @onCancel=""
          />
        </div>
        <div class="grow flex border-2 border-gray-600 rounded">
          <div class="inline-block">
            <table class="text-center w-72 border-r-2 border-gray-600 h-full">
              <tr class="border-b border-gray-600">
                <th class="">
                  <div class="tooltip">
                    Step<span class="tooltiptext tooltip-top arrow-bottom"
                      >Steps to carry out during learning quiz.</span
                    >
                  </div>
                </th>
                <th>
                  <div class="tooltip">
                    Show
                    <span class="tooltiptext tooltip-top arrow-bottom"
                      >Toggle learning quiz step.</span
                    >
                  </div>
                </th>
                <th>
                  <div class="tooltip">
                    Repetitions
                    <span class="tooltiptext tooltip-top arrow-bottom"
                      >Number of times to repeat step during learning quiz
                      before marking kanji as known.
                    </span>
                  </div>
                </th>
              </tr>
              <tr>
                <td>
                  <div class="tooltip">
                    <label class="text-sky-100 font-bold"> Learn</label>
                    <span class="tooltiptext tooltip-left arrow-right"
                      >Memorize writing with kanji outline and auto hints. Full
                      kanji info displayed.
                    </span>
                  </div>
                </td>
                <td>
                  <input
                    class=""
                    type="checkbox"
                    v-model="storeOptions.learnShowLearningStep"
                    @change=""
                  />
                </td>
                <td>
                  <div class="flex justify-center">
                    <AppButton
                      :disabled="storeOptions.learnLearningStepRepetitions <= 1"
                      :text="'-'"
                      class="w-5 h-5 text-xs mr-1 bg-gray-600"
                      @clicked="storeOptions.learnLearningStepRepetitions -= 1"
                    />
                    <span class="w-5 h-5">{{
                      storeOptions.learnLearningStepRepetitions
                    }}</span>
                    <AppButton
                      :disabled="storeOptions.learnLearningStepRepetitions >= 5"
                      :text="'+'"
                      class="w-5 h-5 text-xs ml-1 bg-gray-600"
                      @clicked="storeOptions.learnLearningStepRepetitions += 1"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="tooltip">
                    <label class="text-sky-100 font-bold">Reinforce</label>
                    <span class="tooltiptext tooltip-left arrow-right"
                      >Use quiz to reinforce writing. Auto hints but no outline.
                      Quiz info only.</span
                    >
                  </div>
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
                  <div class="tooltip">
                    <label class="text-sky-100 font-bold"> Quiz </label>
                    <span class="tooltiptext tooltip-left arrow-right"
                      >Test if kanji has been learned. No auto hints or outline.
                    </span>
                  </div>
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
              <span class=""
                ><div class="tooltip">
                  Batch size (kanji):
                  <span class="tooltiptext tooltip-left arrow-right"
                    >Number of kanji to fully learn before moving on to next
                    batch.
                    <br />
                    0 = don't batch kanji</span
                  >
                </div></span
              >
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
              <span class=""
                ><div class="tooltip">
                  Max delay (mins):
                  <span class="tooltiptext tooltip-left arrow-right"
                    >Max number of minutes to wait before pushing kanji to start
                    of review queue.
                    <br />
                    0 = no delay before seeing kanji again.</span
                  >
                </div></span
              >
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
              :disabled="
                nSelected === 0 ||
                (!storeOptions.learnShowLearningStep &&
                  !storeOptions.learnShowReinforceStep &&
                  !storeOptions.learnShowQuizStep)
              "
              :text="'Start'"
              class="w-24 h-8 text-lg ml-4"
              @clicked="startLearnClicked"
            />
            <span class="tooltiptext tooltip-left arrow-right"
              >Start learning quiz using all selected kanji and current
              settings.
              <br />
              - Kanji must be selected.
              <br />
              - At least one learning quiz step must be shown.
            </span>
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
      class="flex justify-center text-white text-opacity-80 font-semibold mx-2 mt-16"
    >
      <p class="">
        Click, click-and-drag, or right click controls below to select kanji to
        learn.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStoreOptions } from "@/stores/storeOptions";
import { useStoreUser } from "@/stores/storeUser";
import { useSelection } from "@/use/useSelection";
import AppLearnHeader from "@/components/Learn/AppLearnHeader.vue";
import AppMarkControls from "@/components/Learn/AppMarkControls.vue";
import AppButton from "@/components/AppButton.vue";
import AppConfirmationDialog from "@/components/Modals/AppConfirmationDialog.vue";

const storeOptions = useStoreOptions();
const storeUser = useStoreUser();

const { selected, setSelectionAsSelected } = useSelection();

const startDialogRef = ref(null);
const resetDialogRef = ref(null);

const startLearnClicked = () => {
  startDialogRef.value.showDialog();
};

const resetClicked = () => {
  resetDialogRef.value.showDialog();
};

const resetConfirmed = () => {
  storeOptions.learnShowLearningStep = true;
  storeOptions.learnShowReinforceStep = true;
  storeOptions.learnShowQuizStep = true;
  storeOptions.learnLearningStepRepetitions = 1;
  storeOptions.learnReinforcementStepRepetitions = 1;
  storeOptions.learnQuizStepRepetitions = 1;
  storeOptions.learnBatchSize = 5;
  storeOptions.learnReviewDelay = 5;
};

const startLearnConfirmed = () => {
  startLearningQuiz();
};

const quickStart = () => {
  const unknown = storeUser.known.map((val) => !val);
  setSelectionAsSelected(unknown, true, true);
  startLearningQuiz();
};

const emit = defineEmits(["startLearning"]);
const startLearningQuiz = () => {
  emit("startLearning");
};

const nSelected = computed(() => selected.value.filter(Boolean).length);
const nKnown = computed(() => storeUser.known.filter(Boolean).length);
</script>

<style scoped></style>
