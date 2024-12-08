document.addEventListener("DOMContentLoaded", () => {

    const userInput = document.getElementById('user-input');
    const searchBtn = document.getElementById('search-btn');
    const statsContainer = document.querySelector('.metrics-section')
    const easyProgCircle = document.querySelector('#easy-progress')
    const midProgCircle = document.querySelector('#mid-progress')
    const hardProgCircle = document.querySelector('#hard-progress')
    const easyLabel = document.getElementById('easy-label')
    const midLabel = document.getElementById('mid-label')
    const hardLabel = document.getElementById('hard-label')
    const statsCard = document.querySelector('.stats-card')

    statsContainer.style.display = "none"

    function validUsername(username) {
        if (username.trim() === "") {
            alert("Username cannot be empty")
            return false
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{0,14}$/
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert('Invalid Username')
        }
        return isMatching
    }

    function updateProgress(solvedQue, totalQue, textLabel, circle) {
        const progressDegree = (solvedQue / totalQue) * 100
        circle.style.setProperty("--progress-deg", `${progressDegree}%`)
        textLabel.textContent = `${solvedQue}/${totalQue}`
    }

    function displayUserData(parsedData) {
        const totalQue = parsedData.totalQuestions
        const totalHardQue = parsedData.totalHard
        const totalMediumQue = parsedData.totalMedium
        const totalEasyQue = parsedData.totalEasy

        const totalSolvedQue = parsedData.totalSolved
        const totalEasySolved = parsedData.easySolved
        const totalMediumSolved = parsedData.mediumSolved
        const totalHardSolved = parsedData.hardSolved

        console.log("logging data:", parsedData);
        updateProgress(totalEasySolved, totalEasyQue, easyLabel, easyProgCircle)
        updateProgress(totalMediumSolved, totalMediumQue, midLabel, midProgCircle)
        updateProgress(totalHardSolved, totalHardQue, hardLabel, hardProgCircle)

        const cardData = [
            {
                label: "Overall Questions",
                value: totalQue,
            }, {
                label: "Overall Submissions",
                value: totalSolvedQue,
            }, {
                label: "Overall Easy Submissions",
                value: totalEasySolved
            }, {
                label: "Overall Medium Submissions",
                value: totalMediumSolved
            }, {
                label: "Overall Hard Submissions",
                value: totalHardSolved
            }
        ]

        console.log('cardData', cardData)
        statsCard.innerHTML = cardData.map((data) => `
                <ul>
                    <li>${data.label}</li>
                    <li>${data.value}</li>
                </ul>
            `).join("")
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try {
            userInput.disabled = true
            searchBtn.textContent = "Searching..."
            searchBtn.disabled = true
            const response = await fetch(url)
            if (!response.ok) {
                console.log(response)
                throw new Error('Unable to fetch userdata')
            }
            const responseData = await response.json()
            statsContainer.style.display = 'flex'
            displayUserData(responseData)
        }
        catch (error) {
            statsContainer.innerHTML = "<p>No data Found</p>"
            console.log(error)
        }
        finally {
            userInput.disabled = false
            searchBtn.textContent = "Search"
            searchBtn.disabled = false
        }
    }

    searchBtn.addEventListener('click', function () {
        const username = userInput.value
        console.log('logged username:', username)

        if (validUsername(username)) {
            fetchUserDetails(username)
        }
    })

})