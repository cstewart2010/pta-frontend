<template>
    <button class="btn btn-secondary" data-bs-toggle="modal" :data-bs-target="'#'+name">
        {{damageBase}}+{{damageAdditional}}
    </button>
    <div class="modal fade" :id="name" tabindex="-1" aria-labelledby="target-modal-label" style="display: none;" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="target-modal-label">Targetting</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <div class="input-group">
                        <span class="input-group-text">What are you targeting?</span>
                        <input type="text" minlength="6" v-model="target" class="form-control">
                        <button class="btn btn-danger" @click="sendLog" data-bs-dismiss="modal">ATTACK!!!</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { postLog } from '../../api/game.api';
import { setPTAActivityToken } from '../../utils/localStorage';
export default {
    name: 'DamageDiceRoll',
    props: {
        user: {
            default: ''
        },
        name: {
            default: ''
        },
        damageBase: {
            default: ''
        },
        damageAdditional: {
            default: 0
        }
    },
    data() {
        return {
            target: '',
            formattedName: ''
        }
    },
    methods: {
        async sendLog() {
            const damage = this.damageBase === '--' ? '' : ` for ${this.calculate()} damage`;
            const action = `used ${this.name.replace('_', ' ')} on ${this.target}${damage}`
            console.log(`${this.user} ${action}`);
            await postLog({
                User: this.user,
                Action: action
            })
            .then(response => {
                setPTAActivityToken(response.headers['pta-activity-token']);
            })
        },
        calculate(){
            const parts = this.damageBase.split('d');
            let damage = this.damageAdditional;
            let dice = JSON.parse(parts[1]);
            for (let i = 0; i < JSON.parse(parts[0]); i++){
                damage += Math.ceil(Math.random() * dice);
            }
            return damage;
        }
    }
}
</script>