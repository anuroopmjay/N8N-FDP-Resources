// Get AI response
const aiResponse = $input.first().json;

// Extract content from Anthropic format
let content = '';
if (aiResponse.content && Array.isArray(aiResponse.content)) {
  const textBlock = aiResponse.content.find(c => c.type === 'text');
  content = textBlock ? textBlock.text : '';
}

// Parse JSON (remove markdown if present)
let plan;
try {
  plan = JSON.parse(content);
} catch (e) {
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  plan = JSON.parse(jsonMatch ? jsonMatch[1] : content);
}

// Get user data from "Code in JavaScript" node
const userData = $('Code in JavaScript').first().json.user;

// Build course cards HTML
const courseCards = plan.selectedCourses.map((course, i) => `
  <div style="background: #f8f9fa; padding: 20px; margin: 15px 0; 
              border-left: 5px solid #667eea; border-radius: 8px;">
    <h3 style="color: #667eea; margin: 0 0 10px 0;">
      ${i + 1}. ${course.courseName}
    </h3>
    <p style="margin: 0 0 8px 0; color: #495057;">
      <strong>Why:</strong> ${course.relevance}
    </p>
    <p style="margin: 0; color: #6c757d; font-size: 14px;">
      ⏱️ ${course.weeklyHours} hrs/week • 
      📅 ${course.durationWeeks} weeks • 
      Starts week ${course.startWeek}
    </p>
  </div>
`).join('');

// Build weekly schedule HTML
const weeklySchedule = plan.weeklyPlan.map(week => `
  <div style="background: white; padding: 15px; margin: 10px 0; 
              border: 1px solid #dee2e6; border-radius: 6px;">
    <div style="margin-bottom: 8px;">
      <span style="background: #667eea; color: white; padding: 4px 12px; 
                   border-radius: 12px; font-weight: bold; margin-right: 10px;">
        Week ${week.week}
      </span>
      <span style="color: #2d3748; font-weight: 600;">${week.course}</span>
    </div>
    <p style="margin: 6px 0; color: #4a5568; font-size: 14px;">
      <strong>Topics:</strong> ${week.topics}
    </p>
    <p style="margin: 6px 0; color: #4a5568; font-size: 14px;">
      <strong>Goals:</strong> ${week.goals}
    </p>
    <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 13px;">
      ⏱️ ${week.hours} hours
    </p>
  </div>
`).join('');

// Build complete email HTML
const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 28px;">
        🎓 Your AI Learning Path
      </h1>
      <p style="margin: 10px 0 0 0; color: white; opacity: 0.9; font-size: 16px;">
        Personalized for ${userData.name}
      </p>
    </div>
    
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #2d3748;">
        Hi <strong>${userData.name}</strong>! 👋
      </p>
      
      <p style="color: #4a5568; line-height: 1.6;">
        Based on your interest in <strong style="color: #667eea;">${userData.interests.join(' and ')}</strong> 
        and your <strong style="color: #667eea;">${userData.experience}</strong> experience, 
        here's your custom learning journey.
      </p>
      
      <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #2d3748; line-height: 1.6;">
          ${plan.summary}
        </p>
      </div>
      
      <h2 style="color: #1a202c; font-size: 22px; margin: 30px 0 15px 0; 
                 border-bottom: 2px solid #667eea; padding-bottom: 10px;">
        📚 Your Courses
      </h2>
      ${courseCards}
      
      <h2 style="color: #1a202c; font-size: 22px; margin: 30px 0 15px 0; 
                 border-bottom: 2px solid #667eea; padding-bottom: 10px;">
        📅 12-Week Schedule
      </h2>
      ${weeklySchedule}
      
      <div style="background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%); 
                  padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin: 0 0 12px 0; color: #2c5282;">💡 Success Tips</h3>
        <ul style="margin: 0; padding-left: 20px; color: #2c5282; line-height: 1.7;">
          <li>Block dedicated study time in your calendar</li>
          <li>Build projects while learning</li>
          <li>Join AI communities for support</li>
          <li>Take notes in your own words</li>
          <li>Share progress on LinkedIn</li>
        </ul>
      </div>
    </div>
    
    <div style="background: #2d3748; padding: 25px; text-align: center;">
      <p style="margin: 0; color: white; font-size: 18px; font-weight: 600;">
        Ready to Start? 🚀
      </p>
      <p style="margin: 10px 0 0 0; color: #cbd5e0; font-size: 13px;">
        AI Course Advisor
      </p>
    </div>
  </div>
</body>
</html>
`;

return [{
  json: {
    to: userData.email,
    subject: `🎓 Your Personalized AI Learning Path - 12 Weeks`,
    html: emailHTML
  }
}];
