const song = document.getElementById("song");

const playBtn = document.querySelector(".player-inner");

const durationTime = document.querySelector(".duration");

const remainingTime = document.querySelector(".remaining");

const rangeBar = document.querySelector(".range");

let isPlaying = true; // Bài nhạc có đang phát hay không?

displayTimer();
const timer = setInterval(displayTimer, 500);

playBtn.addEventListener("click", playPause); // Bấm để tạm dừng

function playPause() {
  // Chuyển qua nút tạm dừng
  if (isPlaying) {
    song.play();
    playBtn.innerHTML = '<i class="fa fa-pause"></i>';
    isPlaying = false; // Khi click sẽ false và chạy xuống else
  } else {
    song.pause();
    playBtn.innerHTML = '<i class="fa fa-play"></i>';
    isPlaying = true;
  }
}

function displayTimer() {
  // Thời gian phát nhạc
  const { duration, currentTime } = song;
  rangeBar.max = duration;
  rangeBar.value = currentTime;
  remainingTime.textContent = formatTimer(currentTime);
  if (!duration) {
    durationTime.textContent = "00:00";
  } else {
    durationTime.textContent = formatTimer(duration);
  }
}

function formatTimer(number) {
  // Chỉnh lại kiểu số 00:00
  const minutes = Math.floor(number / 60);
  const seconds = Math.floor(number - minutes * 60);
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}

rangeBar.addEventListener("change", handleChangeBar);
function handleChangeBar() {
  // Chỉnh thanh kéo
  song.currentTime = rangeBar.value; // Kéo thanh tới chỗ phát nhạc
}
