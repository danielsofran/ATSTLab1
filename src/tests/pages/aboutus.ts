import {BasePage} from "./base"

export class AboutUs extends BasePage {

  async verifyContent() {
    // OUT STORY heading
    const heading = this.page.getByRole('heading', { name: 'OUR STORY' });
    await heading.waitFor();
    // paragraph content
    const content = `Uniquely designed with cosmopolitan appeal, Madison Island gives couture-conscious frequent flyers exactly what they want—unprecedented access to the latest looks of the season, style solutions for easy international jet setting, and convenient worldwide delivery.`
    const paragraph = this.page.getByText(content);
    await paragraph.waitFor();
    // image
    const image = this.page.getByRole('img', { name: 'about-usimage' });
    await image.waitFor();
  }
}