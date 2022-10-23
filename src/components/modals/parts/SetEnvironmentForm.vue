<template>
    <form :id="setEnvironmentFormId" class="needs-validation" @submit.prevent="setEnvironment">
        <h5>Update the Environment</h5>
        <div>
            <select id="environment-select" class="form-select" multiple v-model="newEnvironments">
                <option v-for="(environment, index) in environments" :key="index" :value="environment">
                    {{environment}}
                </option>
            </select>
            <label for="environment-select" class="form-label">Set Environments</label>
        </div>
        <button class="btn btn-secondary" data-bs-dismiss="modal" type="submit">Set</button>
        <hr>
    </form>
</template>

<script>
import { getEnvironments, setEnvironment } from '../../../api/setting.api'
import { generateErrorModal } from '../../../utils/modalUtil'
export default {
    name: 'SetEnvironment',
    props: {
        socket: {
            default: {}
        }
    },
    data(){
        return {
            newEnvironments: [],
            environments: [],
            setEnvironmentFormId: 'set-environment'
        }
    },
    async beforeMount(){
        await getEnvironments()
            .then(response => {
                this.environments = response.data
            })
    },
    methods: {
        async setEnvironment(){
            if (this.newEnvironments.length > 0){
                await setEnvironment(this.newEnvironments.join(','))
                    .then(() => {
                        this.socket.send("");
                        this.newEnvironments = []
                    })
                    .catch(generateErrorModal);
            }
        }
    }
}
</script>