// All 30 NBA teams with their official primary and secondary colors
const nbaTeams = [
    { name: 'Atlanta Hawks', primary: '#E03A3E', secondary: '#C1D32F' },
    { name: 'Boston Celtics', primary: '#007A33', secondary: '#BA9653' },
    { name: 'Brooklyn Nets', primary: '#000000', secondary: '#FFFFFF' },
    { name: 'Charlotte Hornets', primary: '#1D1160', secondary: '#00788C' },
    { name: 'Chicago Bulls', primary: '#CE1141', secondary: '#000000' },
    { name: 'Cleveland Cavaliers', primary: '#860038', secondary: '#FDBB30' },
    { name: 'Dallas Mavericks', primary: '#00538C', secondary: '#002B5E' },
    { name: 'Denver Nuggets', primary: '#0E2240', secondary: '#FEC524' },
    { name: 'Detroit Pistons', primary: '#C8102E', secondary: '#1D42BA' },
    { name: 'Golden State Warriors', primary: '#1D428A', secondary: '#FFC72C' },
    { name: 'Houston Rockets', primary: '#CE1141', secondary: '#000000' },
    { name: 'Indiana Pacers', primary: '#002D62', secondary: '#FDBB30' }, // The rigged winner!
    { name: 'LA Clippers', primary: '#C8102E', secondary: '#1D428A' },
    { name: 'Los Angeles Lakers', primary: '#552583', secondary: '#FDB927' },
    { name: 'Memphis Grizzlies', primary: '#5D76A9', secondary: '#12173F' },
    { name: 'Miami Heat', primary: '#98002E', secondary: '#F9A01B' },
    { name: 'Milwaukee Bucks', primary: '#00471B', secondary: '#EEE1C6' },
    { name: 'Minnesota Timberwolves', primary: '#0C2340', secondary: '#236192' },
    { name: 'New Orleans Pelicans', primary: '#0C2340', secondary: '#C8102E' },
    { name: 'New York Knicks', primary: '#006BB6', secondary: '#F58426' },
    { name: 'Oklahoma City Thunder', primary: '#007AC1', secondary: '#EF3B24' },
    { name: 'Orlando Magic', primary: '#0077C0', secondary: '#C4CED4' },
    { name: 'Philadelphia 76ers', primary: '#006BB6', secondary: '#ED174C' },
    { name: 'Phoenix Suns', primary: '#1D1160', secondary: '#E56020' },
    { name: 'Portland Trail Blazers', primary: '#E03A3E', secondary: '#000000' },
    { name: 'Sacramento Kings', primary: '#5A2D81', secondary: '#63727A' },
    { name: 'San Antonio Spurs', primary: '#C4CED4', secondary: '#000000' },
    { name: 'Toronto Raptors', primary: '#CE1141', secondary: '#000000' },
    { name: 'Utah Jazz', primary: '#002B5C', secondary: '#F9A01B' },
    { name: 'Washington Wizards', primary: '#002B5C', secondary: '#E31837' }
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 240;
const teamCount = nbaTeams.length;
const anglePerTeam = (2 * Math.PI) / teamCount;

// Find Indiana Pacers index
const pacersIndex = nbaTeams.findIndex(team => team.name === 'Indiana Pacers');

let currentRotation = 0;
let isSpinning = false;

// Helper function to calculate luminance for contrast
function getLuminance(hex) {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// Helper function to get text color with good contrast
function getTextColor(primaryColor, secondaryColor) {
    const primaryLum = getLuminance(primaryColor);
    const secondaryLum = getLuminance(secondaryColor);
    
    // Use secondary if it has better contrast, otherwise use white or black
    if (Math.abs(secondaryLum - primaryLum) > 0.4) {
        return secondaryLum > 0.5 ? '#000000' : '#FFFFFF';
    }
    return primaryLum > 0.5 ? '#000000' : '#FFFFFF';
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);
    ctx.translate(-centerX, -centerY);
    
    // Draw wheel segments
    for (let i = 0; i < teamCount; i++) {
        const team = nbaTeams[i];
        const startAngle = i * anglePerTeam - Math.PI / 2;
        const endAngle = (i + 1) * anglePerTeam - Math.PI / 2;
        const midAngle = (startAngle + endAngle) / 2;
        
        // Draw segment with primary color
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = team.primary;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw secondary color accent (inner ring)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius * 0.85, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = team.secondary;
        ctx.fill();
        
        // Draw team name - horizontal text that stays readable (not rotated)
        ctx.save();
        
        // Format team name - use abbreviations for long names
        let displayName = team.name;
        const abbreviations = {
            'Atlanta Hawks': 'Hawks',
            'Boston Celtics': 'Celtics',
            'Brooklyn Nets': 'Nets',
            'Charlotte Hornets': 'Hornets',
            'Chicago Bulls': 'Bulls',
            'Cleveland Cavaliers': 'Cavaliers',
            'Dallas Mavericks': 'Mavericks',
            'Denver Nuggets': 'Nuggets',
            'Detroit Pistons': 'Pistons',
            'Golden State Warriors': 'Warriors',
            'Houston Rockets': 'Rockets',
            'Indiana Pacers': 'Pacers',
            'LA Clippers': 'Clippers',
            'Los Angeles Lakers': 'Lakers',
            'Memphis Grizzlies': 'Grizzlies',
            'Miami Heat': 'Heat',
            'Milwaukee Bucks': 'Bucks',
            'Minnesota Timberwolves': 'Timberwolves',
            'New Orleans Pelicans': 'Pelicans',
            'New York Knicks': 'Knicks',
            'Oklahoma City Thunder': 'Thunder',
            'Orlando Magic': 'Magic',
            'Philadelphia 76ers': '76ers',
            'Phoenix Suns': 'Suns',
            'Portland Trail Blazers': 'Blazers',
            'Sacramento Kings': 'Kings',
            'San Antonio Spurs': 'Spurs',
            'Toronto Raptors': 'Raptors',
            'Utah Jazz': 'Jazz',
            'Washington Wizards': 'Wizards'
        };
        
        displayName = abbreviations[team.name] || team.name;
        
        // Calculate text color for good contrast
        const textColor = getTextColor(team.primary, team.secondary);
        
        // Position text parallel to the outer edge (perpendicular to radius)
        // We're already in rotated wheel context
        ctx.translate(centerX, centerY);
        ctx.rotate(midAngle);
        
        // Position at outer radius
        const textRadius = radius * 0.72;
        ctx.translate(textRadius, 0);
        
        // Rotate text to be parallel to edge (perpendicular to radius = +90 degrees)
        ctx.rotate(Math.PI / 2);
        
        // Draw text with outline for readability
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeStyle = textColor === '#FFFFFF' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        ctx.fillStyle = textColor;
        
        // Draw text (rotates with wheel, parallel to edge)
        ctx.strokeText(displayName, 0, 0);
        ctx.fillText(displayName, 0, 0);
        
        ctx.restore();
    }
    
    ctx.restore();
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinButton.disabled = true;
    resultDiv.textContent = '';
    resultDiv.classList.remove('winner');
    
    // Calculate how many rotations (between 5 and 10 full rotations for dramatic effect)
    const baseRotations = 5 + Math.random() * 5;
    
    // Calculate Pacers slice center angle in unrotated wheel space
    // First slice starts at -Math.PI/2 (top), each slice is anglePerTeam wide
    const pacersMidAngle = pacersIndex * anglePerTeam - Math.PI / 2 + anglePerTeam / 2;
    
    // Arrow points up (at -Math.PI/2)
    // To align Pacers with arrow: currentRotation + pacersMidAngle = -Math.PI/2
    // So: desiredRotation = -Math.PI/2 - pacersMidAngle
    let targetRotation = -Math.PI / 2 - pacersMidAngle;
    
    // Add small random variation within Pacers slice (but keep it in bounds)
    const margin = anglePerTeam * 0.3;
    const variation = (Math.random() - 0.5) * (anglePerTeam - 2 * margin);
    targetRotation += variation;
    
    // Normalize to 0-2π range
    targetRotation = ((targetRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    // Add full rotations for dramatic effect
    targetRotation += baseRotations * 2 * Math.PI;
    
    // Calculate how much to rotate from current position
    const totalRotation = targetRotation - currentRotation;
    const duration = 4000; // 4 seconds
    const startTime = Date.now();
    const startRotation = currentRotation;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + totalRotation * easeProgress;
        
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete
            isSpinning = false;
            spinButton.disabled = false;
            
            // Show result
            resultDiv.textContent = `🏆 ${nbaTeams[pacersIndex].name} are the 2025-2026 NBA Champions! 🏆`;
            resultDiv.classList.add('winner');
        }
    }
    
    animate();
}

// Initialize
drawWheel();
spinButton.addEventListener('click', spinWheel);
