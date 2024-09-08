<script setup>
import { ref } from 'vue';

const emits = defineEmits(['fileUploaded'])

const dropFileZone = ref()
const uploadInput = ref()
const isActive = ref(false);

["dragover", "drop"].forEach(function (event) {
    document.addEventListener(event, function (evt) {
        evt.preventDefault()
        return false
    })
})

const onDragEnter = () => {
    isActive.value = true;
}

const onDragLeave = () => {
    isActive.value = false;
}

const onDrop = (event) => {
    isActive.value = false;
    const file = event.dataTransfer?.files[0]
    if (!file) {
        return
    }

    if (file.type.startsWith("image/")) {
        uploadInput.value.files = event.dataTransfer.files
        emits('fileUploaded', file);
    } else {
        // Alert user to upload only images
        return false
    }
}

const onFileChange = () => {
    const file = uploadInput.value.files?.[0]
    if (file && file.type.startsWith("image/")) {
        emits('fileUploaded', file);
    } else {
        // Alert user to upload only images
        return false
    }
}
</script>

<template>
    <div class="upload-zone">
        <div class="upload-zone_dragover text-primary dark:text-white" @drop="onDrop" @dragenter="onDragEnter"
            @dragleave="onDragLeave" ref="dropFileZone" :class="{ '_active': isActive }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" class="upload-loader__image">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9" />
                <path d="m16 16-4-4-4 4" />
            </svg>
            <p>Drag-n-drop image here</p>
            <span class="file-upload__hint">You can upload only images.</span>
        </div>
        <label class="file-upload__label" for="uploadInput">
            <span class="file-upload__title">Or upload using button</span>
            <input class="file-upload__input" ref="uploadInput" @change="onFileChange" type="file" name="file_name"
                accept="image/*" aria-describedby="hint">
        </label>
        <div class="file-upload__container">
            <span class="file-upload__hint" id="uploadFile_Hint"></span>
        </div>
    </div>
</template>

<style scoped>
.upload-zone {
    width: 100%;
}

.upload-zone_dragover {
    display: grid;
    height: 300px;
    min-height: 300px;
    margin-bottom: 25px;
    border: 1px solid currentColor;
    border-radius: 5px;
    font-weight: 500;
    font-size: 18px;
    place-content: center;
    text-align: center;
}

.upload-zone_dragover svg {
    width: 10vw;
    margin: auto;
    pointer-events: none;
}

.file-upload__hint {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
}

.upload-zone_dragover._active {
    color: #004d0a;
    background-color: #18770077;
}

.file-upload__label {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.file-upload__title {
    margin-right: 55px;
}

.file-upload__input {
    font-family: inherit;
    font-size: 18px;
}

.file-upload__input::file-selector-button {
    margin-right: 30px;
    border: none;
    border-radius: 6px;
    padding: 9px 15px;
    font-family: inherit;
    font-weight: inherit;
    transition: background-color 0.2s linear;
    cursor: pointer;
}

.file-upload__container {
    margin-top: 10px;
    font-size: 16px;
}

.upload-hint,
.upload-status {
    width: 75%;
}

.upload-hint {
    display: none;
}

.upload-hint_visible {
    display: block;
    pointer-events: none;
}

.upload-loader {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.upload-loader_visible {
    display: flex;
    justify-content: center;
    align-items: center;
}

.upload-loader__image {
    height: 150px;
}

@media (max-width: 768px) {
    .upload-zone {
        padding: 55px 30px;
    }

    .file-upload__title {
        display: block;
        margin-right: 0;
    }

    .file-upload__input::file-selector-button {
        min-width: initial;
        margin-right: 10px;
    }
}
</style>