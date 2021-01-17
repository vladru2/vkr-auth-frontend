<template>
    <div class="wrapper">
        <div class="title">
            {{ title }}
        </div>

        <div class="content flex flex_vert expand">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ContentWrapper',
    props: {
        title: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped>
.wrapper {
    min-height: 600px;
    max-width: 340px;
}

.title {
    position: absolute;
    right: 0;
    top: -50px;
    color: white;
    font-size: 24px;
    line-height: 29px;
}

.content {
    position: relative;
    width: 100%;
    padding: 0 10px;
}

@media screen and (min-width: 450px) {
    .content {
        width: 340px;
    }
}
</style>

<style>
input,
button,
label,
a {
    transition: all 0.3s ease;
}

input,
button,
.button {
    border: none;
    border-radius: 5px;
    height: 40px;
    line-height: 40px;
    width: 100%;
    font-weight: normal;
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
    text-decoration: none;
}

input[type='text'],
input[type='password'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

input {
    background: #e2e7e9;
    color: #6e8291;
    border: 1px solid #e2e7e9;
    font-weight: normal;
    padding: 0 0 0 10px;
}

input:hover,
input:focus {
    border: 1px solid #39abf7;
}

input:focus {
    background: #f1f3f4;
}

input:focus {
    color: #424e57;
}

input:focus:not(.invalid_input) {
}

button,
.button {
    font-weight: bold;
    color: white;
    background: linear-gradient(84.36deg, #0988dd 0%, #39abf7 100%);
    cursor: pointer;
}

button:hover,
.button:hover {
    box-shadow: 0px 0px 5px rgba(9, 136, 221, 0.3);
}

button:focus,
.button:focus {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

label {
    float: top;
    color: #808080;
    align-self: start;
    font-style: normal;
    line-height: 22px;
    width: 100%;
}

input:focus + label {
    color: #39abf7;
}

.red_button {
    background: linear-gradient(84.36deg, #f44336 0%, #ff7961 100%);
}

.gray_button {
    background: #aaaaaa;
}

.recaptcha {
    border-radius: 3px;
}

.invalid_input {
    border: 1px solid #ff5c5c;
    background-color: #ecdfdf;
}

.invalid_input_description {
    position: absolute;
    font-weight: normal;
    color: #ff5c5c;
}

.flex_vert_r {
    -ms-flex-direction: column-reverse;
    flex-direction: column-reverse;
}

.details {
    font-weight: normal;
    color: #808080;
}
</style>
