import TopPartners from '@/components/molecules/TopPartners';
import ValuesCard from '@/components/atoms/ValuesCard';
import HomePageTitle from '@/components/atoms/homePageTitle';

export default function Home() {
  const images = Array.from({ length: 20 }, (_, index) => index + 1);

  return (
    <>
      <div className="relative w-full h-[45vh] bg-cover bg-center lg:h-[70vh]">
        <img src="/images/hero image.png" alt="hero image" className="absolute object-cover h-[100%] w-[100%]" />
        <div className="relative z-10 flex flex-col justify-center h-full text-white items-center text-center px-5 lg:items-start lg:text-start lg:justify-evenly lg:pl-[7rem]">
          <div className="text-sm lg:max-w-[55%]">
            <div className="mb-3">Lorem ipsum</div>
            <h1 className="text-2xl font-bold mb-4 lg:text-3xl">
              Lorem ipsum dolor, sit asd amet consectetur consectetur consectetur adipisicing elit.
            </h1>
          </div>

          <div className="flex flex-col justify-center items-center lg:items-start lg:max-w-[40%]">
            <p className="text-l font-light mb-8">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cum voluptatibus quibusdam nisi, nostrum
              amet maiores perspiciatis
            </p>
            <button className="p-2 bg-[#01C38D] hover:bg-blue-600 text-white rounded-md flex justify-evenly items-center w-[150px] text-s font-semibold">
              Get Started
              <img src="/icons/arrow.svg" alt="" className="w-7" />
            </button>
          </div>
        </div>
      </div>

      <div className='lg:hidden'>
        <TopPartners />
      </div>

      <div className="px-10 lg:flex lg:justify-between lg:py-10">
        <div className="lg:max-w-[30%] lg: mr-10">
          <HomePageTitle title={'Our Values'} />
          <div className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia commodi blanditiis asperiores delectus
            recusandae magnam provident deserunt, quas nihil voluptates.
          </div>
        </div>
        <div className="flex flex-wrap gap-2 my-5 ">
          <div className="w-[48%]">
            <ValuesCard />
          </div>
          <div className="w-[48%]">
            <ValuesCard />
          </div>
          <div className="w-[48%]">
            <ValuesCard />
          </div>
          <div className="w-[48%]">
            <ValuesCard />
          </div>
        </div>
      </div>
    </>
  );
}
