<template>
<div v-if="isActuallyAdmin">
    <div class="row" v-for="(user, index) in users" :key="index">
        <div class="col-4">
            {{user.username}} (User since {{new Date(user.dateCreated).toLocaleString()}})
        </div>
        <div class="col">
            <select class="form-select">
                <option value="" selected>Messages</option>
                <option v-for="(message, index) in user.messages" :key="index" :value="message">
                    {{message}}
                </option>
            </select>
        </div>
        <div class="col">
            <select class="form-select">
                <option value="" selected>Games</option>
                <option v-for="(game, index) in user.games" :key="index" :value="game">
                    {{game}}
                </option>
            </select>
        </div>
        <div class="col-1">
            <button class="btn-close" data-bs-toggle="modal" :data-bs-target="'#userConfirmationModal'+user.userId" />
        </div>
        <delete-user :user="user" />
        <hr>
    </div>
    <div class="d-flex justify-content-between">
        <button class="btn btn-secondary col-2" @click="getUsers(previous.offset, previous.limit)">
            Previous
        </button>
        <button class="btn btn-secondary col-2" @click="getUsers(next.offset, next.limit)">
            Next
        </button>
    </div>
</div>
</template>

<script>
import { getUsers } from '../api/user.api'
import { setIsAdmin } from '../utils/localStorage'
import { generateNavigationModal } from '../utils/modalUtil'
import DeleteUser from '../components/modals/DeleteUser.vue'
export default {
    name: 'MissionControl',
    data(){
        return {
            isActuallyAdmin: false,
            users: [],
            previous: {
                offset: 0,
                limit: 20
            },
            next: {
                offset: 0,
                limit: 20
            }
        }
    },
    components: {
        DeleteUser
    },
    async mounted(){
        await this.getUsers(0, 20)
            .then(() => {
                this.isActuallyAdmin = true
            })
            .catch(() => {
                setIsAdmin(false);
                generateNavigationModal("Nice Try", "Nothing to see here. Let's go back home.", "/");
            })
    },
    methods: {
        async getUsers(offset, limit){
            await getUsers(offset, limit)
                .then(response => {
                    this.previous = response.data.previous;
                    this.next = response.data.next;
                    this.users = response.data.users;
                });
        }
    }
}
</script>