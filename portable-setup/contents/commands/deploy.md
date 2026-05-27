# Deploy

<command_meta>
  <name>deploy</name>
  <description>Deploy your app to production with pre-flight checks, optimization, and SSL setup. Use when ready to go live, pushing updates, or doing an emergency hotfix deploy.</description>
  <agent>deployment-specialist</agent>
  <confidence>0.91</confidence>
  <token_estimate>500</token_estimate>
  <patterns>["deployment-checklist", "hosting-optimization", "go-live-process"]</patterns>
  <success_rate>0.94</success_rate>
  <flags>
    <flag name="--emergency">Skip full validation, run only 5 critical checks for urgent deployments</flag>
  </flags>
</command_meta>

## Command Purpose

<purpose>
  <primary>Deploy the user's app to a live URL that others can access</primary>
  <secondary>Ensure optimal performance and security in production</secondary>
  <tertiary>Provide clear instructions for managing the live app</tertiary>
</purpose>

## User Interaction Strategy

<interaction_style>
  <tone>exciting, confident, celebratory</tone>
  <approach>handle all technical complexity while building anticipation</approach>
  <language_level>focus on the end result rather than technical processes</language_level>
</interaction_style>

## Deployment Workflow

<workflow>
  <step number="1" agent="deployment-specialist" duration="30 seconds">
    <title>Pre-Deployment Check</title>
    <description>I'll verify your app is ready for the world to see</description>
    <user_message>Checking that everything is perfect before going live...</user_message>
    <actions>
      - Verify all functionality works
      - Check for broken links or missing assets
      - Ensure mobile responsiveness
      - Validate performance metrics
      - Test cross-browser compatibility
    </actions>
  </step>
  
  <step number="2" agent="deployment-specialist" duration="1 min">
    <title>Optimizing for Production</title>
    <description>I'll optimize your app for best performance and security</description>
    <user_message>Optimizing your app for lightning-fast loading...</user_message>
    <actions>
      - Compress and optimize images
      - Minify CSS and JavaScript
      - Enable caching strategies
      - Configure security headers
      - Optimize loading performance
    </actions>
  </step>
  
  <step number="3" agent="deployment-specialist" duration="2-3 min">
    <title>Deploying to Production</title>
    <description>I'll publish your app to a reliable hosting service</description>
    <user_message>Publishing your app to the internet... Almost there!</user_message>
    <actions>
      - Choose optimal hosting platform
      - Upload optimized files
      - Configure domain and SSL
      - Set up CDN for global performance
      - Initialize monitoring
    </actions>
  </step>
  
  <step number="4" agent="deployment-specialist" duration="1 min">
    <title>Final Testing</title>
    <description>I'll test your live app to ensure everything works perfectly</description>
    <user_message>Testing your live app to make sure everything works perfectly...</user_message>
    <actions>
      - Test live URL functionality
      - Verify SSL certificate
      - Check loading speeds
      - Test from different locations
      - Validate mobile performance
    </actions>
  </step>
</workflow>

## Hosting Platform Selection

<hosting_platforms>
  <platform name="vercel" recommended="true" app_types="['business-website', 'portfolio', 'landing-page']">
    <benefits>
      - Automatic HTTPS and CDN
      - Lightning-fast global performance
      - Automatic deployments
      - Free tier available
    </benefits>
    <setup_time>2-3 minutes</setup_time>
    <cost>Free for most projects</cost>
  </platform>
  
  <platform name="netlify" recommended="true" app_types="['blog', 'business-website', 'portfolio']">
    <benefits>
      - Simple drag-and-drop deployment
      - Built-in form handling
      - Automatic SSL certificates
      - Global CDN included
    </benefits>
    <setup_time>2-3 minutes</setup_time>
    <cost>Free for most projects</cost>
  </platform>
  
  <platform name="github-pages" recommended="false" app_types="['portfolio', 'blog']">
    <benefits>
      - Free hosting
      - Integrated with GitHub
      - Custom domains supported
      - Good for simple sites
    </benefits>
    <setup_time>3-5 minutes</setup_time>
    <cost>Always free</cost>
  </platform>
</hosting_platforms>

## Pre-Deployment Checklist

<deployment_checklist>
  <critical_checks>
    <check name="functionality_test">
      <description>All features and pages work correctly</description>
      <auto_fix>true</auto_fix>
      <blocking>true</blocking>
    </check>
    
    <check name="mobile_responsiveness">
      <description>Perfect display and functionality on mobile devices</description>
      <auto_fix>true</auto_fix>
      <blocking>true</blocking>
    </check>
    
    <check name="broken_links">
      <description>No broken links or missing resources</description>
      <auto_fix>true</auto_fix>
      <blocking>true</blocking>
    </check>
    
    <check name="performance_baseline">
      <description>Acceptable loading speeds and performance</description>
      <auto_fix>true</auto_fix>
      <blocking>false</blocking>
    </check>
  </critical_checks>
  
  <optimization_checks>
    <check name="image_optimization">
      <description>Images compressed and properly sized</description>
      <auto_fix>true</auto_fix>
      <impact>medium</impact>
    </check>
    
    <check name="css_minification">
      <description>CSS files minimized for faster loading</description>
      <auto_fix>true</auto_fix>
      <impact>low</impact>
    </check>
    
    <check name="security_headers">
      <description>Basic security configurations in place</description>
      <auto_fix>true</auto_fix>
      <impact>medium</impact>
    </check>
  </optimization_checks>
</deployment_checklist>

## Success Response Template

<success_response>
  <message>🚀 Your app is now LIVE on the internet!</message>
  
  <deployment_details>
    **🌐 Your Live URL**: {{live_url}}
    
    **📊 Deployment Stats**:
    • ⚡ Loading speed: {{load_time}}ms (Excellent!)
    • 🔒 SSL security: Enabled
    • 📱 Mobile optimization: Perfect
    • 🌍 Global CDN: Active
    • 📈 Performance score: {{performance_score}}/100
    
    **🎯 What This Means**:
    ✅ Anyone can visit your app using the URL above
    ✅ It loads quickly from anywhere in the world
    ✅ It's secure with HTTPS encryption
    ✅ It works perfectly on phones, tablets, and computers
    ✅ Search engines can find and index it
  </deployment_details>
  
  <sharing_guide>
    **📢 Ready to Share!**
    
    Your app is now ready for visitors! You can:
    • Share the URL with friends, family, or customers
    • Add it to your social media profiles
    • Include it in your email signature
    • Print it on business cards
    • Submit it to search engines
    
    **🔗 Easy sharing**: {{live_url}}
  </sharing_guide>
  
  <next_steps>
    <immediate>
      <command>/show-me-progress</command>
      <reason>Celebrate what you've accomplished and see the full journey</reason>
      <benefit>Get a complete overview of your successful app launch</benefit>
    </immediate>
    
    <alternatives>
      <option>
        <command>/add-this-feature "analytics tracking"</command>
        <reason>Add visitor tracking to see how your app is performing</reason>
      </option>
      <option>
        <command>/make-it-look-better</command>
        <reason>Continue enhancing the design now that it's live</reason>
      </option>
      <option>
        <command>/test-everything</command>
        <reason>Run comprehensive tests on the live version</reason>
      </option>
    </alternatives>
  </next_steps>
  
  <celebration>
    🎉 **CONGRATULATIONS!** 🎉
    
    You just went from an idea to a live, working app that anyone in the world can access! 
    
    This is a huge accomplishment. You now have:
    • A professional web presence
    • A platform to share your ideas or business
    • Technical skills that many people find intimidating
    • Something tangible you built and can be proud of
    
    Take a moment to visit your live app and celebrate - you did this! 🌟
  </celebration>
</success_response>

## Post-Deployment Management

<management_info>
  <updating_content>
    <title>Making Changes to Your Live App</title>
    <process>
      1. Make changes using Claude commands (like `/add-this-feature`)
      2. Test changes work correctly
      3. Run `/deploy-when-ready` again to update the live version
      4. Changes will be live within 2-3 minutes
    </process>
    <note>Your URL stays the same - only the content updates</note>
  </updating_content>
  
  <monitoring>
    <title>Keeping Track of Your App</title>
    <metrics>
      - Visitor statistics (if analytics added)
      - Loading performance
      - Uptime and availability
      - Mobile vs desktop usage
    </metrics>
    <access>Available through hosting platform dashboard</access>
  </monitoring>
  
  <maintenance>
    <title>Keeping Your App Healthy</title>
    <tasks>
      - Regular content updates
      - Performance monitoring
      - Security updates (handled automatically)
      - Backup management (handled automatically)
    </tasks>
    <frequency>Check monthly, update as needed</frequency>
  </maintenance>
</management_info>

## Error Handling

<error_scenarios>
  <scenario name="deployment-failed">
    <condition>Technical error during deployment process</condition>
    <response>
      Don't worry! Deployment failed, but this happens sometimes. Let me try a different approach:
      
      **What might have happened:**
      • Temporary hosting service issue
      • File size or configuration problem
      • Network connectivity issue
      
      **What I'm doing:**
      1. Switching to a different hosting platform
      2. Checking and fixing any file issues
      3. Trying the deployment again
      
      Your app will be live soon - technical hiccups like this are normal and always fixable!
    </response>
  </scenario>
  
  <scenario name="app-not-ready">
    <condition>App has critical issues that prevent deployment</condition>
    <response>
      I found some issues that should be fixed before going live:
      
      {{#each blocking_issues}}
      ❌ **{{this.category}}**: {{this.description}}
      {{/each}}
      
      **Good news**: These are all fixable! Let me handle them automatically:
      
      1. I'll run `/fix-whatever-is-broken` to resolve the issues
      2. Then I'll come back and deploy your app
      3. Everything will be working perfectly
      
      This just means your app will be even better when it goes live!
    </response>
  </scenario>
  
  <scenario name="performance-concerns">
    <condition>App works but has performance issues</condition>
    <response>
      Your app works great, but I noticed it could be faster. I can:
      
      **Option 1: Deploy Now** (Recommended)
      • Your app works perfectly and is ready for users
      • I can optimize performance after it's live
      • You can start sharing it immediately
      
      **Option 2: Optimize First**
      • I'll improve loading speeds before deployment
      • Takes an extra 5-10 minutes
      • Results in faster initial user experience
      
      What would you prefer? Most people choose to go live now and optimize later!
    </response>
  </scenario>
</error_scenarios>

## Pattern Optimization

<optimization_patterns>
  <pattern name="deployment-checklist" token_savings="160">
    <description>Standard pre-deployment validation and testing process</description>
    <reference>[PATTERN:DEPLOYMENT_CHECKLIST]</reference>
  </pattern>
  
  <pattern name="hosting-optimization" token_savings="140">
    <description>Platform selection and performance optimization</description>
    <reference>[PATTERN:HOSTING_OPTIMIZATION]</reference>
  </pattern>
  
  <pattern name="go-live-process" token_savings="120">
    <description>Deployment execution and post-launch validation</description>
    <reference>[PATTERN:GO_LIVE_PROCESS]</reference>
  </pattern>
</optimization_patterns>

## Analytics and Monitoring Setup

<analytics_setup>
  <basic_tracking>
    <service>Google Analytics 4</service>
    <setup_time>2 minutes</setup_time>
    <provides>
      - Visitor count and demographics
      - Page views and popular content
      - Traffic sources
      - Device and browser stats
    </provides>
  </basic_tracking>

  <performance_monitoring>
    <service>Built-in hosting analytics</service>
    <setup_time>Automatic</setup_time>
    <provides>
      - Loading speed metrics
      - Uptime monitoring
      - Bandwidth usage
      - Error tracking
    </provides>
  </performance_monitoring>
</analytics_setup>

## --emergency Flag: Quick Deploy

When `/deploy --emergency` is used, run only these 5 critical checks:

<emergency_checklist>
  <check number="1" name="build" blocking="true">
    <title>Does it build?</title>
    <command>npm run build</command>
    <action>If fails, cannot deploy</action>
  </check>

  <check number="2" name="secrets" blocking="true">
    <title>Any exposed secrets?</title>
    <actions>
      - Quick search for API keys in code
      - Verify .env is in .gitignore
    </actions>
  </check>

  <check number="3" name="starts" blocking="true">
    <title>Does it start?</title>
    <command>npm start</command>
    <actions>
      - Visit localhost:3000
      - Confirm no white screen of death
    </actions>
  </check>

  <check number="4" name="auth" blocking="true">
    <title>Can users log in?</title>
    <actions>
      - Test login flow
      - If broken, deployment fails
    </actions>
  </check>

  <check number="5" name="database" blocking="false">
    <title>Is the database connected?</title>
    <actions>
      - Check if data loads
      - Verify connection string
    </actions>
  </check>
</emergency_checklist>

**Warning**: Emergency deploys skip full validation. Use only when necessary and monitor closely after deployment.