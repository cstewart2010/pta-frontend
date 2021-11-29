<template>
    <div>
        <h2>Landing</h2>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, beatae molestiae! Voluptatum adipisci reprehenderit laboriosam? Dignissimos consequatur beatae distinctio ab, officia quisquam pariatur placeat voluptatibus assumenda laboriosam ut, cumque accusamus.
        </p>
        <div class="row">
            <div class="col-4">
                <label for="trainerName">Trainer Name: </label>
                <input type="text" name="trainerName" id="trainerName">
            </div>
            <div class="col-4">
                <label for="password">Password: </label>
                <input type="password" name="password" id="password">
            </div>
            <div class="col-4">
                <label for="confirm">Confirm Password: </label>
                <input type="password" name="confirm" id="confirm">
            </div>
            <button class="btn btn-primary" @click="signIn">Sign in</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LandingPage",
        data() {
            return {

            }
        },
        mounted:function(){
            
        },
        methods: {
            signIn(){
                const trainerName = document.getElementById("trainerName").value;
                const password = document.getElementById("password").value;
                const confirm = document.getElementById("confirm").value;
                if (!(trainerName && password && confirm)){
                    alert("Please fill out all fields");
                }

                else if (trainerName.length < 6 || password.length < 6){
                    alert("Trainer name and password must be at least 6 characters long");
                }

                else if (password != confirm){
                    alert("Passwords do not match");
                }
                
                else {
                    // handle create new trainer
                    alert("Success!");
                    this.$router.push('next-page')
                }
            }
        }
    }
</script>

<style scoped>
</style>