<template>
  <div style="width: 100%">
    <div class="text-h6 q-mb-sm">Create a Voting Session</div>
    <hr />
    <div>
      <q-form style="" @submit="createSession">
        <div class="row q-gutter-lg">
          <q-input
            class="col-xm-12 col-sm-10 col-md-4 col-lg-3"
            filled
            type="text"
            v-model="form.title"
            label="Session Title"
            name="title"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'The title field cannot be empty',
            ]"
          />
          <q-input
            class="col-xm-12 col-sm-10 col-md-3 col-lg-3"
            filled
            stack-label
            type="datetime-local"
            v-model="form.startDate"
            label="Start Date"
            name="startDate"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'The start date field cannot be empty',
            ]"
          />
          <q-input
            stack-label
            class="col-xm-12 col-sm-10 col-md-3 col-lg-3"
            filled
            type="datetime-local"
            v-model="form.endDate"
            label="End Date"
            name="endDate"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'The end date field cannot be empty',
            ]"
          />
          <q-input
            class="col-xm-10 col-sm-10 col-md-10 col-lg-10"
            filled
            type="textarea"
            v-model="form.description"
            label="Session Description"
            name="title"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'The title field cannot be empty',
            ]"
          />
          <q-file
            filled
            bottom-slots
            max-file-size="20480000"
            @rejected="onRejected"
            v-model="form.logo"
            label="Session Logo"
            counter
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop />
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop="model = null"
                class="cursor-pointer"
              />
            </template>

            <template v-slot:hint> Upload a voting session logo </template>
          </q-file>
        </div>
        <hr />

        <Categories
          @update-categories="updateCategories($event, argz)"
          :categories="categories"
          :session_is_new="true"
        />

        <div class="q-mt-md col-sm-10">
          <q-btn v-if="!loading" label="Submit" type="submit" color="primary" />
          <q-spinner-tail v-else color="primary" size="2em" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
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

    return {
      form,
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
    };
  },
};
</script>
