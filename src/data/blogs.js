export const blogs = [
  {
    slug: 'human-centered-design-in-the-age-of-ai',
    title: 'Human-Centered Design in the Age of AI',
    category: 'Design',
    date: 'MAY 2026',
    readTime: '22 MIN READ',
    image: '/mandara/Assets/blogs/hcd-ai-blog.png',
    excerpt: 'As AI reshapes our digital interfaces, designing for people with genuine empathy has never mattered more.',
    content: `
      <p>We are living through one of the most consequential transitions in the history of product design. Every assumption we held about how users interact with software is being rapidly dismantled by artificial intelligence.</p>
      <p>Human-Centered Design (HCD) was never just a methodology. It was a declaration: that the needs, emotions, limitations, and aspirations of real human beings must sit at the center of every design decision.</p>
    `
  },

  {
    slug: 'designing-trustworthy-payment-flows',
    title: 'Designing trustworthy payment flows',
    category: 'Product',
    date: 'JAN 2025',
    readTime: '5 MIN READ',
    image: '/mandara/Assets/blogs/payment-flow.png',
    excerpt: 'How we shaped low-friction, high-trust experiences for millions of shoppers at Amazon Pay by focusing on micro-copy and timing.',
    content: `
      <p>Trust is the invisible currency of the internet. When it comes to payment flows, that currency is more valuable than ever. At Amazon Pay, we spent months iterating on a single goal: how do we make users feel safe without adding friction?</p>
      
      <h3>The Psychology of the Checkout</h3>
      <p>A checkout process is a high-anxiety moment. Users are about to part with their hard-earned money. Any flicker of doubt—a slow loader, a confusing label, or an unexpected redirect—can lead to abandonment.</p>
      
      <blockquote>"The best interface is the one that disappears when it's working and supports you when it's not."</blockquote>
      
      <h3>Micro-copy and Clarity</h3>
      <p>We found that changing "Proceed" to "Review your order" increased completion rates by 4.2%. Why? Because "Proceed" feels like a commitment to spend, while "Review" feels like a safe step to verify details.</p>
      
      <pre><code>// Example of a clear, trust-building review state
const ReviewState = ({ amount, items }) => (
  <div className="review-container">
    <h2>Review your order</h2>
    <p>You won't be charged yet.</p>
    <div className="total-row">
      <span>Total:</span>
      <span>\${amount}</span>
    </div>
    <button className="confirm-btn">Complete Purchase</button>
  </div>
);</code></pre>

      <h3>The Role of Timing</h3>
      <p>Interestingly, some processes can be *too* fast. When a security check happens instantly, users often feel it didn't actually happen. We introduced "perceived effort" into our verification loaders—artificial delays that communicate the complexity of the security check happening behind the scenes.</p>
      
      <h3>Key Takeaways</h3>
      <ul>
        <li>Be transparent about every step.</li>
        <li>Use human language over technical jargon.</li>
        <li>Acknowledge and celebrate the successful completion.</li>
      </ul>
    `
  },
  {
    slug: 'from-brief-to-launch-in-10-days',
    title: 'From brief to launch in 10 days',
    category: 'Process',
    date: 'DEC 2024',
    readTime: '4 MIN READ',
    image: '/mandara/Assets/blogs/speed-launch.png',
    excerpt: 'A fast-track case study on aligning stakeholders, prototyping in code, and shipping with confidence under tight deadlines.',
    content: `
      <p>Speed is a feature. In the fast-paced world of tech, the ability to move from an idea to a live product in less than two weeks is a competitive advantage.</p>
      
      <h3>Eliminating the "Hand-off"</h3>
      <p>The traditional Waterfall method of "Designer creates Figma → Developer builds" is too slow for a 10-day sprint. Instead, we worked in parallel. I designed directly in React, using a shared component library that our engineers were already familiar with.</p>
      
      <h3>Scope Creep is the Enemy</h3>
      <p>On Day 1, we defined a "Minimum Awesome Product." If a feature wasn't critical to the core value proposition, it was moved to V2. This required radical honesty with stakeholders.</p>
      
      <h3>Continuous Deployment</h3>
      <p>We pushed to a staging environment every single evening. This allowed for daily testing and immediate feedback loops. By Day 8, we weren't "finishing" the build; we were just polishing the edges.</p>
      
      <pre><code># Our deployment script for rapid iteration
git checkout production
git merge staging
npm run build
vercel --prod --confirm</code></pre>

      <h3>The Result</h3>
      <p>We launched on Day 10 with 0 critical bugs and a 90% satisfaction rate among early testers. The secret wasn't working harder—it was working smarter and closer together.</p>
    `
  },
  {
    slug: 'microinteractions-that-earn-trust',
    title: 'Microinteractions that earn trust',
    category: 'Engineering',
    date: 'NOV 2024',
    readTime: '3 MIN READ',
    image: '/mandara/Assets/blogs/microinteractions.png',
    excerpt: 'Small motions that guide users and reduce anxiety in checkout, identity verification, and confirmation screens.',
    content: `
      <p>Microinteractions are the "small moments" where the user and the design interact. While they seem minor, they are the difference between a product that feels "okay" and one that feels "premium."</p>
      
      <h3>The "Success" Haptic</h3>
      <p>A subtle bounce when a form is submitted successfully provides immediate sensory feedback. It confirms the action without the user needing to read a "Success!" message.</p>
      
      <h3>Skeleton States over Spinners</h3>
      <p>Loading spinners focus the user's attention on the wait. Skeleton states, however, focus the user's attention on the *content* that is about to arrive. It makes the app feel faster, even if the load time is identical.</p>
      
      <pre><code>/* CSS for a smooth skeleton pulse */
.skeleton {
  background: linear-gradient(
    90deg,
    #131316 25%,
    #1c1c21 50%,
    #131316 75%
  );
  background-size: 200% 100%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}</code></pre>

      <h3>Error Handling with Empathy</h3>
      <p>Instead of a harsh red "Invalid Input," we used a gentle shake animation on the input field. It mimics a person shaking their head "no"—a universal signal that is intuitive and less frustrating.</p>
      
      <h3>Designing for Delight</h3>
      <p>Microinteractions shouldn't just be functional; they can be delightful. A small confetti burst after a first-time purchase or a smooth transition between pages creates a memorable brand experience.</p>
    `
  },
  {
    slug: 'the-designer-who-codes',
    title: 'The designer who codes',
    category: 'Career',
    date: 'OCT 2024',
    readTime: '6 MIN READ',
    image: '/mandara/Assets/blogs/designer-coding.png',
    excerpt: 'Why learning React changed my design career and how it bridges the gap between Figma files and production environments.',
    content: `
      <p>For years, there has been a debate: "Should designers code?" After a decade in the industry, my answer is a resounding yes. Not because you need to be a full-stack engineer, but because understanding the medium you design for makes you a better designer.</p>
      
      <h3>Closing the Gap</h3>
      <p>Figma is a static representation of a dynamic system. When you understand how Flexbox works, you stop designing layouts that are impossible to implement responsively. When you understand state, you start designing for the "edge cases"—the empty states, the loading states, and the error states.</p>
      
      <h3>Prototyping with Real Data</h3>
      <p>Prototyping in code allows you to test with real data. It's one thing to see a design with "Lorem Ipsum," but it's another to see it with 50 actual user comments. Code reveals the flaws in your design that a static mockup never will.</p>
      
      <pre><code>// Dynamic data in a prototype
const CommentList = ({ comments }) => (
  <div className="comments">
    {comments.map(c => (
      <div key={c.id} className="comment">
        <strong>{c.user}</strong>
        <p>{c.text}</p>
      </div>
    ))}
  </div>
);</code></pre>

      <h3>Speaking the Same Language</h3>
      <p>When I can talk to an engineer about "prop drilling" or "component lifecycle," the relationship shifts from transactional to collaborative. We become partners in building the product, rather than adversaries in a hand-off process.</p>
      
      <h3>Conclusion</h3>
      <p>Learning to code didn't take away from my design skills; it amplified them. It gave me a new set of tools to bring my visions to life exactly as I imagined them.</p>
    `
  }
];
