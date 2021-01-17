<template>
    <div>
        <div>
            <div class="flex flex_vert_r">
                <input
                    id="input_new_pass"
                    type="password"
                    v-model="newPass"
                    :class="{ invalid_input: invalid.newPass }"
                    v-on:keyup.enter="submit"
                />
                <div class="spacer_tiny" />
                <label for="input_new_pass"> {{ $t('label.new-password') }} </label>
            </div>
            <div v-if="invalid.newPass" class="invalid_input_description">
                {{ $t('error.invalid.password') }}
            </div>
        </div>

        <div class="spacer_medium" />

        <div>
            <div class="flex flex_vert_r">
                <input
                    id="input_pass_repeat"
                    type="password"
                    v-model="passRepeat"
                    :class="{ invalid_input: invalid.passRepeat }"
                    v-on:keyup.enter="submit"
                />
                <div class="spacer_tiny" />
                <label for="input_pass_repeat"> {{ $t('label.password-repeat') }} </label>
            </div>
            <div v-if="invalid.passRepeat" class="invalid_input_description">
                {{ $t('error.invalid.password-repeat') }}
            </div>
        </div>

        <div class="spacer_medium" />

        <button @click="submit" :class="{ gray_button: !validateInput() }">
            {{ $t('button.change-password') }}
        </button>
    </div>
</template>

<script>
import { validatePassword } from '@/hcs/constraints'

export default {
    name: 'NewPassword',

    data() {
        return {
            newPass: '',
            passRepeat: '',
            invalid: {
                newPass: false,
                passRepeat: false,
            },
        }
    },
    methods: {
        submit() {
            if (this.validateInput()) {
                this.$emit('submit', this.newPass)
            }
        },
        validateInput() {
            const { invalid } = this
            let valid = true

            let invalidPassword = true
            if (validatePassword(this.newPass)) {
                invalid.newPass = false
                invalidPassword = false
            } else {
                valid = false
            }

            if (!invalidPassword && this.newPass === this.passRepeat) {
                invalid.passRepeat = false
            } else {
                valid = false
            }

            return valid
        },
    },
    beforeUpdate() {
        if (this.newPass) this.invalid.newPass = true
        if (this.passRepeat) this.invalid.passRepeat = true
        this.validateInput()
    },
}
</script>

<style scoped></style>
