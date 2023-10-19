window.onload = function () {
    const replyDiv = document.getElementById('reply');
    const input = document.getElementById('input');
    document.onkeyup = async function (ev) {
        if (ev.key === 'Enter') {
            replyDiv.innerHTML = await reply(input.value)
        }
    }
}