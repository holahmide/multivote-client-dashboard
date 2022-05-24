<template>
  <div>
    <div class="q-px-md">
      <div class="text-h6">Nominees (Add & Edit)</div>

      <div class="q-pa-sm row wrap q-col-gutter-lg">
        <div
          class="col-12 col-md-6"
          v-for="(nominee, index) in sortWithVotes(nominees)"
          :key="index"
          :style="
            !nominee.is_new && nominee.category.id === category.id
              ? ''
              : 'display:none;'
          "
        >
          <div class="row bg-white shadow-10" v-if="!nominee.is_new">
            <div v-if="nominee.picture_preview" class="col-12 col-md-4">
              <q-img
                spinner-color="primary"
                spinner-size="50px"
                :src="BACKEND_URL + nominee.picture_preview"
                alt=""
                style="max-height: 270px; min-height: 180px"
                class="q-mr-sm"
              />
            </div>
            <div class="q-pa-sm col-12 col-md-8">
              <div class="text-h6">
                <b>{{ nominee.name ? nominee.name.toUpperCase() : "" }}</b>
              </div>
              <div class="text-h6">
                {{ nominee.regno ? nominee.regno : "No Reg No." }}
              </div>
              <div class="text-subtitle-1">
                {{ nominee.department ? nominee.department : "Not specified" }}
              </div>
              <!-- <div class="text-primary text-subtitle-2 q-mt-sm">
                {{ nominee.votes }} vote(s)
              </div> -->
              <div class="q-mt-sm">
                <div>
                  <q-btn
                    v-if="!nominee.is_new"
                    :disabled="nominee.is_new"
                    label="Update"
                    color="primary"
                    class="q-mr-md"
                    @click="editNominee(nominee.s_n)"
                  />
                  <!-- <q-btn
                    v-if="!nominee.is_new"
                    label="Delete"
                    color="secondary"
                    @click="confirmDeleteNominee(nominee.s_n)"
                  /> -->
                  <q-btn
                    v-if="nominee.is_new"
                    label="Save All"
                    color="primary"
                    class="q-mr-md"
                    @click="saveAddedNominees"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-table
        class="q-mt-md"
        no-data-label="No new nominee has been added"
        :title="`Create nominees for ${
          category ? category.name.toUpperCase() : ''
        }`"
        :rows="filterNominees(nominees)"
        :columns="columns"
        row-key="name"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              <q-input
                filled
                :readonly="!props.row.is_new"
                label="Enter Nominee name"
                v-model="props.row.name"
              />
            </q-td>
            <q-td key="name" :props="props">
              <q-input
                type="number"
                filled
                :readonly="!props.row.is_new"
                label="Enter Nominee regno"
                v-model="props.row.regno"
              />
            </q-td>
            <q-td key="department" :props="props">
              <q-select
                filled
                v-model="props.row.department"
                :options="departments"
                :readonly="!props.row.is_new"
                emit-value
                map-options
                label="Department"
              />
            </q-td>
            <q-td key="picture" :props="props">
              <q-file
                v-if="props.row.is_new"
                filled
                clearable
                bottom-slots
                accept=".jpg, image/*"
                max-file-size="20480000"
                @rejected="onRejected"
                v-model="props.row.picture"
                label="Nominee Logo"
                @update:model-value="onImageSelect(props.row.s_n)"
              >
                <template v-slot:prepend>
                  <q-icon name="image" />
                </template>

                <template v-slot:hint> Upload the nominee picture </template>
              </q-file>
              <div v-else>
                <q-icon
                  v-if="props.row.picture_preview"
                  name="check"
                  color="green"
                />
                <q-icon v-else name="close" color="red" />
              </div>
            </q-td>
            <q-td key="picture_preview" :props="props">
              <div v-if="props.row.picture_preview">
                <q-img
                  spinner-color="primary"
                  spinner-size="50px"
                  :src="props.row.picture_preview"
                  alt=""
                  width="70px"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-form
        @submit="addNomineesField"
        class="q-ma-md row justify-center"
        style="text-align: center; width: 100%"
      >
        <q-input
          type="number"
          filled
          v-model="addNomineesFieldNumber"
          label="Add Nominee e.g 2"
          class="col-sm-6 col-md-3 col-lg-3"
        />
        <q-btn
          label="Add"
          class="q-ml-md"
          icon="add"
          type="submit"
          color="primary"
        />
        <q-btn
          label="Save for Category"
          class="q-ml-md"
          icon="save"
          type="button"
          color="primary"
          @click="saveAddedNominees"
        />

        <q-dialog v-model="confirmAddedNominees" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar
                icon="question_mark"
                color="primary"
                text-color="white"
              />
              <span class="q-ml-sm" v-html="addedNomineesMessage"></span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                :disabled="loading"
                label="Cancel"
                color="primary"
                v-close-popup
              />
              <q-btn
                flat
                label="Create"
                color="positive"
                @click="createNominees"
                :loading="loading"
                :disabled="loading"
              >
                <template v-slot:loading>
                  <q-spinner-tail class="on-left" />
                  Creating...
                </template>
              </q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-form>

      <div>
        <q-dialog v-model="showEditNomineeModal" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Edit Nominee</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <b class="q-mb-sm">{{
                editNomineeData.category.name.toUpperCase()
              }}</b>
              <br /><br />

              <q-input
                filled
                label="Enter Nominee name"
                v-model="editNomineeData.name"
              />
              <br />
              <q-select
                filled
                v-model="editNomineeData.department"
                :options="departments"
                emit-value
                map-options
                label="Department"
              />
              <br />
              <q-file
                filled
                clearable
                bottom-slots
                accept=".jpg, image/*"
                max-file-size="20480000"
                @rejected="onRejected"
                v-model="editNomineeData.picture"
                label="Nominee Picture"
                @update:model-value="onUpdateImageSelect()"
              >
                <template v-slot:prepend>
                  <q-icon name="image" />
                </template>

                <template v-slot:hint> Upload the nominee picture </template>
              </q-file>
              <q-img
                spinner-color="primary"
                spinner-size="50px"
                :src="BACKEND_URL + editNomineeData.picture_preview"
                alt=""
                width="150px"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn :disabled="isUpdating" flat label="Cancel" v-close-popup />
              <q-btn
                label="Update"
                color="primary"
                @click="updateNominee()"
                :disabled="isUpdating"
                :loading="isUpdating"
                ><template v-slot:loading>
                  <q-spinner-tail class="on-left" /> </template
              ></q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showDeleteNomineeModal" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar
                icon="question_mark"
                color="primary"
                text-color="white"
              />
              <span class="q-ml-sm"
                >Are you sure you want to delete "{{
                  deleteNomineeData.name ? deleteNomineeData.name : "?"
                }}" from the category
                {{
                  deleteNomineeData.category
                    ? `"${deleteNomineeData.category.name}"`
                    : "?"
                }}</span
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
                @click="deleteNominee()"
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
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, watch, toRefs } from "vue";
import { useNomineeStore } from "@/store/session/nominee";
import { useRouter } from "vue-router";

export default {
  props: ["nominees", "sn", "categories", "sessionSlug", "category"],
  setup(props) {
    const BACKEND_URL = process.env.VUE_APP_BACKEND_URL;
    const router = useRouter();
    const $q = useQuasar();
    const nomineeStore = useNomineeStore();
    const { sn, nominees, categories, sessionSlug, category } = toRefs(props);
    const s_n = ref(sn.value);
    const columns = [
      {
        name: "name",
        align: "center",
        label: "Name",
        field: "name",
        sortable: true,
      },
      {
        name: "regno",
        align: "center",
        label: "Reg. No.",
        field: "regno",
        sortable: true,
      },
      {
        name: "department",
        align: "center",
        label: "Department",
        field: "department",
        sortable: true,
      },
      { name: "picture", label: "Picture", field: "picture" },
      { name: "picture_preview", label: "Preview", field: "picture_preview" },
    ];
    const nomineeField = {
      name: "",
      regno: "",
      category: null,
      picture: "",
      is_new: true,
      picture_preview: null,
    };
    const departments = [
      "Electrical and Information Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Agric & Biosystems Engineering",
    ];
    const addNomineesFieldNumber = ref(1);
    const confirmAddedNominees = ref(false);
    const addedNomineesMessage = ref(false);
    let loading = ref(false);

    watch(nominees, (value) => {
      props.emit("updateNominees", value);
    });

    const addNomineesField = () => {
      for (let i = 0; i < addNomineesFieldNumber.value; i++) {
        nominees.value.unshift(
          Object.assign(
            {},
            { ...nomineeField, s_n: s_n.value, category: category.value.id }
          )
        );
        s_n.value++;
      }
    };
    const saveAddedNominees = () => {
      let no_name = 0;
      let no_regno = 0;
      nominees.value.map((nominee) => {
        if (nominee.is_new) {
          if (!nominee.name) no_name++;
          if (!nominee.regno) no_regno++;
        }
      });
      addedNomineesMessage.value = `${
        no_name ? no_name : "No"
      } Nominees found without name and ${
        no_regno ? no_regno : "No"
      } nominees found without regno.  <br />
        Any nominee without regno or name will not saved on the server.`;
      confirmAddedNominees.value = true;
    };

    const createNominees = () => {
      loading.value = true;
      let nomineesArr = nominees.value.map((a) => {
        return { ...a }; // to clone it
      });
      nomineesArr = nomineesArr.filter(function (el) {
        return (
          el.is_new && el.name && el.regno && el.category === category.value.id
        );
      });
      if (!nomineesArr.length) {
        confirmAddedNominees.value = false;
        loading.value = false;
        return $q.notify("No new nominees with name and regno found!");
      }
      var formData = new FormData();
      nomineesArr.map((nominee) => {
        if (nominee.is_new) {
          formData.append(`image-${nominee.s_n}`, nominee.picture);
        }
        delete nominee.picture;
        nominee.category = category.value.id;
      });
      formData.append("nominees", JSON.stringify(nomineesArr));
      formData.append("session", sessionSlug.value);
      nomineeStore
        .createMultiple(formData)
        .then((response) => {
          if (response && response.status) {
            $q.notify({
              message: "You have successfully created the nominees",
              type: "positive",
            });
            $q.loading.show({
              message:
                "We are updating the page content (Page might reload). Hang on...</span>",
              html: true,
            });
            setTimeout(() => {
              router.go();
            }, 1000);
          }
        })
        .catch(() => {
          $q.notify({
            message: "An error occurred",
            type: "negative",
          });
        })
        .finally(() => {
          loading.value = false;
          confirmAddedNominees.value = false;
        });
    };

    const onRejected = () => {
      $q.notify({
        message:
          "File couldn't be uploaded please ensure it is not more than 10MB",
        type: "negative",
      });
    };

    const onImageSelect = (s_n) => {
      const index = nominees.value.findIndex((el) => el.s_n == s_n);
      if (index > -1) {
        nominees.value[index].picture_preview = null; // clears preview when picture is cleared
        if (nominees.value[index].picture) {
          const image_url = URL.createObjectURL(nominees.value[index].picture);
          nominees.value[index].picture_preview = image_url;
        }
      }
    };

    const onUpdateImageSelect = () => {
      editNomineeData.value.picture_preview = null; // clears preview when picture is cleared
      if (editNomineeData.value.picture) {
        const image_url = URL.createObjectURL(editNomineeData.value.picture);
        editNomineeData.value.picture_preview = image_url;
      }
    };

    const showEditNomineeModal = ref(false);
    const editNomineeData = ref(null);
    const showDeleteNomineeModal = ref(false);
    const deleteNomineeData = ref(null);
    const isDeleting = ref(false);
    const isUpdating = ref(false);
    const editNominee = (s_n) => {
      editNomineeData.value = null;
      editNomineeData.value = findObjectIndex(nominees.value, "s_n", s_n);
      showEditNomineeModal.value = true;
    };
    const updateNominee = (
      nominee = Object.assign({}, editNomineeData.value)
    ) => {
      isUpdating.value = true;
      const index = nominees.value.findIndex((el) => el.s_n == nominee.s_n);
      if (nominee.is_new) {
        $q.notify("operation not allowed!");
        isUpdating.value = false;
      } else {
        var formData = new FormData();
        if (nominee.picture && typeof nominee.picture != "string") {
          formData.append(`picture`, nominee.picture);
        }
        delete nominee.picture; // Remove picture object from nominee object
        delete nominee.votes; // Remove votes from nominee object
        if (typeof nominee.category == "object")
          nominee.category = nominee.category.id; // Change category object to its ID
        Object.keys(nominee).forEach((key) => {
          formData.append(key, nominee[key]);
        });
        nomineeStore
          .update(nominee.id, formData)
          .then((response) => {
            nominees.value[index] = {
              ...nominee,
              category: findObjectIndex(
                categories.value,
                "id",
                response.data.updatedNominee.category
              ),
              picture: response.data.updatedNominee.picture,
              picture_preview: response.data.updatedNominee.picture,
            };
            $q.notify({
              message: "Successfully updated nominee",
              type: "positive",
            });
            showEditNomineeModal.value = false;
          })
          .catch(() => {
            $q.notify({
              message: "Couldn't update the nominee! Try again",
              type: "negative",
            });
          })
          .finally(() => {
            isUpdating.value = false;
          });
      }
    };
    const confirmDeleteNominee = (s_n) => {
      deleteNomineeData.value = findObjectIndex(nominees.value, "s_n", s_n);
      if (
        !deleteNomineeData.value.name &&
        !deleteNomineeData.value.category &&
        !deleteNomineeData.value.picture
      )
        return deleteNominee(deleteNomineeData.value); // delete straight up
      if (typeof deleteNomineeData.value.category == "string")
        deleteNomineeData.value.category = findObjectIndex(
          categories.value,
          "id",
          deleteNomineeData.value.category
        );
      showDeleteNomineeModal.value = true;
    };
    const deleteNominee = async (nominee = deleteNomineeData.value) => {
      isDeleting.value = true;
      const index = nominees.value.findIndex((el) => el.s_n == nominee.s_n);
      if (index > -1) {
        if (nominee.is_new) {
          nominees.value.splice(index, 1);
          $q.notify({
            message: "Successfully deleted nominee",
            type: "positive",
          });
          isDeleting.value = false;
          showDeleteNomineeModal.value = false;
        } else {
          nomineeStore
            .delete(nominee.id)
            .then(() => {
              nominees.value.splice(index, 1);
              $q.notify({
                message: "Successfully deleted nominee",
                type: "positive",
              });
              showDeleteNomineeModal.value = false;
            })
            .catch(() => {
              $q.notify({
                message: "Couldn't delete the nominee! Try again",
                type: "negative",
              });
            })
            .finally(() => {
              isDeleting.value = false;
            });
        }
      }
    };

    const findObjectIndex = (array, key, value) => {
      const index = array.findIndex((el) => el[key] == value);
      if (index > -1) {
        return Object.assign({}, array[index]);
      } else return {};
    };

    const filterNominees = (data) => {
      return data.filter((el) => {
        if (typeof el.category == "object") {
          return el.is_new && el.category.id === category.value.id;
        } else {
          return el.is_new && el.category === category.value.id;
        }
      });
    };

    const sortWithVotes = (nominees) => {
      return nominees.sort((a,b) => b.votes - a.votes);
    }

    return {
      loading,
      columns,
      addNomineesField,
      addNomineesFieldNumber,
      saveAddedNominees,
      confirmAddedNominees,
      addedNomineesMessage,
      createNominees,
      onRejected,
      onImageSelect,

      editNomineeData,
      deleteNomineeData,
      showEditNomineeModal,
      showDeleteNomineeModal,
      editNominee,
      updateNominee,
      confirmDeleteNominee,
      deleteNominee,
      isDeleting,
      isUpdating,
      onUpdateImageSelect,
      BACKEND_URL,
      filterNominees,
      departments,
      sortWithVotes
    };
  },
};
</script>
