import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

interface Article {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  read: string;
  color: string;
}

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.page.html',
  styleUrls: ['./blogs.page.scss'],
  standalone: false,
})
export class BlogsPage {
  selectedCategory = 'All';

  categories = ['All', 'Tips', 'Trends', 'Guides', 'News'];

  featured: Article = {
    title: 'How to Get the Best Price for Your Old iPhone in 2025',
    excerpt: "iPhone resale values have never been higher. Here's exactly how to maximise your payout before upgrading.",
    category: 'Tips',
    date: '2 Jul 2025',
    read: '5 min read',
    color: '#4F7EFF',
  };

  articles: Article[] = [
    {
      title: 'Samsung Galaxy S25 vs iPhone 16: Which Holds Value Better?',
      excerpt: 'A deep-dive into depreciation curves for the two flagship giants.',
      category: 'Trends',
      date: '28 Jun 2025',
      read: '7 min read',
      color: '#00D2B8',
    },
    {
      title: 'Ultimate Guide to Factory Resetting Any Android Phone',
      excerpt: 'Step-by-step instructions to wipe your data safely before selling.',
      category: 'Guides',
      date: '20 Jun 2025',
      read: '4 min read',
      color: '#FFB547',
    },
    {
      title: 'Recello Hits ₹10 Crore in Payouts to Sellers',
      excerpt: 'A milestone that shows how much trust sellers place in the platform.',
      category: 'News',
      date: '15 Jun 2025',
      read: '3 min read',
      color: '#7B5EA7',
    },
    {
      title: '5 Signs Your MacBook Is Ready to Be Sold',
      excerpt: "Battery health, performance dips, and age — how to know it's time.",
      category: 'Tips',
      date: '10 Jun 2025',
      read: '6 min read',
      color: '#4F7EFF',
    },
    {
      title: 'Why Tablet Prices Are Rising This Quarter',
      excerpt: 'Chip shortages and demand spikes are pushing resale values up.',
      category: 'Trends',
      date: '5 Jun 2025',
      read: '5 min read',
      color: '#00D2B8',
    },
  ];

  constructor(private navCtrl: NavController) { }

  get filteredArticles(): Article[] {
    if (this.selectedCategory === 'All') return this.articles;
    return this.articles.filter((a) => a.category === this.selectedCategory);
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
  }

  back() {
    this.navCtrl.back();
  }
}
