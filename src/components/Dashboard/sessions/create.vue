<template>
  <div style="width: 100%">
    <div class="text-h6 q-mb-sm">Create a Voting Session</div>
    <hr />
    <div>
      <q-form
        style="width: 100%"
        @submit="createSession"
        @validation-error="showValidationError"
      >
        <div class="full-width row">
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              type="text"
              v-model="form.title"
              label="Session Title *"
              name="title"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'The title field cannot be empty',
              ]"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              stack-label
              type="datetime-local"
              v-model="form.startDate"
              label="Start Date *"
              name="startDate"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'The start date field cannot be empty',
              ]"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              stack-label
              filled
              type="datetime-local"
              v-model="form.endDate"
              label="End Date *"
              name="endDate"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'The end date field cannot be empty',
              ]"
            />
          </div>
          <div class="col-12 q-px-md">
            <q-input
              filled
              type="textarea"
              v-model="form.description"
              label="Session Description"
              name="title"
              lazy-rules
            />
          </div>
          <div class="col-12 q-pa-md">
            <q-img
              v-if="form.logo_preview"
              spinner-color="primary"
              spinner-size="50px"
              :src="form.logo_preview"
              alt=""
            />
          </div>
          <div class="col-xm-10 col-sm-10 col-md-12 col-lg-12 q-px-md">
            <q-file
              filled
              clearable
              bottom-slots
              accept=".jpg, image/*"
              max-file-size="20480000"
              @rejected="onRejected"
              v-model="form.logo"
              label="Session Logo"
              @update:model-value="onImageSelect()"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>

              <template v-slot:hint> Upload a voting session logo </template>
            </q-file>
          </div>
        </div>
        <hr />

        <Categories
          @update-categories="updateCategories($event, argz)"
          :categories="categories"
          :session_is_new="true"
        />

        <div class="row">
          <div class="q-mt-md col-sm-12 q-pa-md">
            <q-btn
              v-if="!loading"
              label="Submit"
              type="submit"
              color="primary"
              style="width: 100%"
            />
            <q-spinner-tail v-else color="primary" size="2em" />
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useSessionStore } from "@/store/session/index";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import Categories from "./session/categories";
export default {
  components: {
    Categories,
  },
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const sessionStore = useSessionStore();

    const loading = ref(false);
    const form = ref({
      title: null,
      startDate: null,
      endDate: null,
      description: null,
      logo: null,
      logo_preview: null,
    });

    const createSession = () => {
      var formData = new FormData();
      Object.keys(form.value).forEach((key) => {
        formData.append(key, form.value[key]);
      });
      formData.append("categories", JSON.stringify(categories.value));
      loading.value = true;
      sessionStore
        .create(formData)
        .then((response) => {
          if (response && response.status) {
            $q.notify({
              message: "You have successfully created a new session!",
              type: "positive",
            });
            router.push({ name: "sessions" });
            loading.value = false;
          }
        })
        .catch(() => {
          loading.value = false;
          $q.notify({
            message: "An error occurred",
            type: "negative",
          });
        });
    };

    const onRejected = () => {
      $q.notify({
        message:
          "File couldn't be uploaded please ensure it is not more than 10000kb",
        type: "negative",
      });
    };

    const categories = ref([]);
    const newCategory = ref(null);
    const showEditCategoryModal = ref(false);
    const editCategoryData = ref(null);
    const showDeleteCategoryModal = ref(false);
    const deleteCategoryData = ref(null);
    const addCategory = () => {
      if (!newCategory.value) return;
      const item = { name: newCategory.value.toUpperCase() };
      if (categories.value.findIndex((el) => el.name == item.name) > -1)
        return $q.notify("Category already exists");
      categories.value.push(item);
      $q.notify({
        message: `Successfully added category '${newCategory.value}'`,
        type: "positive",
      });
      newCategory.value = null;
    };
    const editCategory = (category) => {
      editCategoryData.value = JSON.parse(
        JSON.stringify({ new: category, old: category })
      );
      showEditCategoryModal.value = true;
    };
    const updateCategory = (category = editCategoryData.value) => {
      if (!category.new.name) return $q.notify("category name cannot be empty");
      const index = categories.value.findIndex(
        (el) => el.name == category.old.name
      );
      if (index > -1) categories.value[index] = category.new;
      $q.notify({
        message: "Successfully updated category",
        type: "positive",
      });
      showEditCategoryModal.value = false;
    };
    const confirmDeleteCategory = (e, category) => {
      deleteCategoryData.value = JSON.parse(JSON.stringify(category));
      showDeleteCategoryModal.value = true;
      e.stopPropagation();
    };
    const deleteCategory = (category = deleteCategoryData.value) => {
      const index = categories.value.findIndex(
        (el) => el.name == category.name
      );
      if (index > -1) {
        categories.value.splice(index, 1);
        $q.notify({
          message: "Successfully deleted category",
          type: "positive",
        });
        showDeleteCategoryModal.value = false;
      }
    };

    const updateCategories = (categories) => {
      categories.value = JSON.parse(JSON.stringify(categories));
    };

    const onImageSelect = () => {
      form.value.logo_preview = null; // clears preview when logo is cleared
      if (form.value.logo) {
        const image_url = URL.createObjectURL(form.value.logo);
        form.value.logo_preview = image_url;
      }
    };

    const showValidationError = () => {
      $q.notify({
        message: "Validation Error: Ensure all the required fields have been filled",
        type: "negative",
      });
    };

    return {
      form,
      showValidationError,
      createSession,
      loading,
      onRejected,
      categories,
      newCategory,
      editCategoryData,
      deleteCategoryData,
      showEditCategoryModal,
      showDeleteCategoryModal,
      addCategory,
      editCategory,
      updateCategory,
      confirmDeleteCategory,
      deleteCategory,
      updateCategories,
      onImageSelect,
    };
  },
};
</script>
