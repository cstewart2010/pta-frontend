<template>
    <form :id="removeFormId" class="needs-validation" @submit.prevent="removeFromEncounter">
        <h5>Remove from Encounter</h5>
        <div>
            <select id="remove-id" v-model="removalOption" class="form-select" required>
                <option value="" selected disabled></option>
                <option
                    v-for="(activeParticipant, index) in activeParticipants"
                    :key="index"
                    :value="activeParticipant.ParticipantId">
                    ({{activeParticipant.Type}}) {{activeParticipant.Name}}
                </option>
            </select>
            <label for="remove-id" class="form-label">Remove from encounter</label>
            <validation-feedback name="Removal selection" :useInvalid="false" />
        </div>
        <button class="btn btn-danger" data-bs-dismiss="modal" type="submit">Remove</button>
    </form>
</template>

<script>
import { removeFromActiveEncounter } from '../../../api/setting.api'
import { checkValidation, removeValidation } from '../../../utils/credentials'
import { generateErrorModal } from '../../../utils/modalUtil'
import ValidationFeedback from '../../partials/ValidationFeedback.vue'
export default {
    name: 'RemoveFromEncounter',
    props: {
        activeParticipants: {
            default: []
        },
        socket: {
            default: {}
        }
    },
    data(){
        return {
            removeFormId: "remove-from-encounter",
            removalOption: ''
        }
    },
    components:{
        ValidationFeedback
    },
    methods: {
        async removeFromEncounter(){
            if (!checkValidation(this.removeFormId)){
                return;
            }
            await removeFromActiveEncounter(this.removalOption)
                .then(() => {
                    removeValidation(this.removeFormId);
                    this.socket.send("")
                })
                .catch(generateErrorModal)
        }
    }
}
</script>