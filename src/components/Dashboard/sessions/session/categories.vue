<template>
  <div>
    <div class="q-px-md">
      <div class="text-h6">Categories (Add & Edit)</div>
      <div class="text-body2">
        Create categories for your voting session e.g
        <code>Best in sports</code>
      </div>
      <div class="row q-gutter-lg">
        <q-input
          class="col-xm-8 col-sm-8 col-md-4 col-lg-4"
          filled
          type="text"
          v-model="newCategory"
          label="Enter new category"
          name="category"
        />
        <q-btn
          label="Add"
          type="button"
          icon="add"
          color="primary"
          @click="addCategory"
          :disabled="isCreating"
          :loading="isCreating"
          ><template v-slot:loading>
            Creating ...
            <q-spinner-tail class="on-left" /> </template
        ></q-btn>
      </div>

      <div
        class="bg-grey-3 q-mt-md q-pa-sm"
        style="height: 200px; overflow-y: auto"
      >
        <div style="">
          <div v-if="categories.length > 0" class="q-pa-sm">
            <span
              class="q-pa-sm q-ma-xs q-mb-md bg-grey"
              style="
                border-radius: 2px;
                display: inline-block;
                cursor: pointer;
                padding: 7px;
                margin: 6px;
              "
              rounded
              v-for="(category, index) in categories"
              :key="index"
              @click="editCategory(category)"
            >
              {{ category.name.toUpperCase() }}
              <span>
                <q-icon
                  @click="confirmDeleteCategory($event, category)"
                  name="close"
                  class="q-text-lg"
                />
              </span>
            </span>
          </div>
          <div v-else>
            <div class="text-body2">No categories added yet</div>
          </div>
        </div>
      </div>

      <q-dialog v-model="showEditCategoryModal">
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">
              Edit Category {{ editCategoryData.old.name }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="editCategoryData.new.name"
              autofocus
              @keyup.enter="prompt = false"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn :disabled="isUpdating" flat label="Cancel" v-close-popup />
            <q-btn
              label="Update"
              color="primary"
              @click="updateCategory()"
              :disabled="isUpdating"
              :loading="isUpdating"
              ><template v-slot:loading>
                <q-spinner-tail class="on-left" /> </template
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showDeleteCategoryModal" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="question_mark" color="primary" text-color="white" />
            <span class="q-ml-sm"
              >Are you sure you want to delete "{{
                deleteCategoryData.name
              }}"</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              :disabled="isDeleting"
              flat
              label="Cancel"
              color="primary"
              v-close-popup
            />
            <q-btn
              flat
              label="Delete"
              color="negative"
              @click="deleteCategory()"
              :disabled="isDeleting"
              :loading="isDeleting"
              ><template v-slot:loading>
                <q-spinner-tail class="on-left" /> </template
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { ref, toRefs } from "vue";
import { useQuasar } from "quasar";
import { useCategoryStore } from "@/store/session/category";

export default {
  props: ["categories", "session", "session_is_new"],
  emits: ["update-categories"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const categoryStore = useCategoryStore();

    const { categories, session } = toRefs(props);
    const newCategory = ref(null);
    const showEditCategoryModal = ref(false);
    const editCategoryData = ref(null);
    const showDeleteCategoryModal = ref(false);
    const deleteCategoryData = ref(null);
    const isDeleting = ref(false);
    const isUpdating = ref(false);
    const isCreating = ref(false);
    const addCategory = () => {
      if (!newCategory.value) return;
      const item = {
        name: newCategory.value.toUpperCase(),
        session: session.value,
      };
      if (
        categories.value.findIndex((el) => el.name.toUpperCase() == item.name) >
        -1
      )
        return $q.notify("Category already exists");
      if (props.session_is_new) {
        // If there is no need to send data to backend
        $q.notify({
          message: `Successfully added category '${newCategory.value}'`,
          type: "positive",
        });
        categories.value.push(item);
        newCategory.value = null;
        emit("update-categories", categories.value);
      } else {
        isCreating.value = true;
        categoryStore
          .create(item)
          .then(({ data }) => {
            if (data) {
              $q.notify({
                message: `Successfully added category '${newCategory.value}'`,
                type: "positive",
              });
            }
            categories.value.push({
              ...data.createdCategory,
              id: data.createdCategory._id,
            });
            newCategory.value = null;
          })
          .catch(() => {
            $q.notify({
              message: "An error occurred",
              type: "negative",
            });
          })
          .finally(() => {
            isCreating.value = false;
          });
      }
    };
    const editCategory = (category) => {
      editCategoryData.value = JSON.parse(
        JSON.stringify({ new: category, old: category })
      );
      editCategoryData.value.new.name =
        editCategoryData.value.new.name.toUpperCase();
      showEditCategoryModal.value = true;
    };
    const updateCategory = (category = editCategoryData.value) => {
      // Check for empty value
      if (!category.new.name) return $q.notify("category name cannot be empty");
      // get category index
      const index = categories.value.findIndex(
        (el) => el.id == category.old.id
      );
      // check if its same with its previous value
      if (
        categories.value[index].name.toUpperCase() ===
        category.new.name.toUpperCase()
      ) {
        showEditCategoryModal.value = false;
        return $q.notify({
          message: "Successfully updated category",
          type: "positive",
        });
      }
      // check if the value already exists
      const checkIfExists = categories.value.findIndex(
        (el) => el.name.toUpperCase() == category.new.name.toUpperCase()
      );
      if (checkIfExists > -1) {
        return $q.notify("A category already exists with this category name");
      }
      if (props.session_is_new) {
        // If there is no need to send data to backend
        categories.value[index].name = category.new.name;
        $q.notify({
          message: `Successfully updated category '${category.old.name}' to '${category.new.name}'`,
          type: "positive",
        });
        showEditCategoryModal.value = false;
        emit("update-categories", categories.value);
      } else {
        // continue to update on the server
        isUpdating.value = true;
        console.log(categories.value[index]);
        categoryStore
          .update(categories.value[index].id, category.new)
          .then((response) => {
            $q.notify({
              message: `Successfully updated category '${category.old.name}' to '${category.new.name}'`,
              type: "positive",
            });
            categories.value[index] = Object.assign(
              {},
              {
                ...response.data.updatedCategory,
                id: response.data.updatedCategory._id,
              }
            );
            showEditCategoryModal.value = false;
          })
          .catch(() => {
            $q.notify({
              message: "An error occurred",
              type: "negative",
            });
          })
          .finally(() => {
            isUpdating.value = false;
          });
      }
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
        if (props.session_is_new) {
          // If there is no need to delete data at the backend
          categories.value.splice(index, 1);
          showDeleteCategoryModal.value = false;
          $q.notify({
            message: `Successfully deleted category '${category.name}'`,
            type: "positive",
          });
          emit("update-categories", categories.value);
        } else {
          isDeleting.value = true;
          categoryStore
            .delete(categories.value[index].id)
            .then(() => {
              $q.notify({
                message: `Successfully deleted category '${category.name}'`,
                type: "positive",
              });
              categories.value.splice(index, 1);
              showDeleteCategoryModal.value = false;
            })
            .catch(() => {
              $q.notify({
                message: "An error occurred",
                type: "negative",
              });
            })
            .finally(() => {
              isUpdating.value = false;
            });
        }
      }
    };

    return {
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
      isDeleting,
      isUpdating,
    };
  },
};
</script>
