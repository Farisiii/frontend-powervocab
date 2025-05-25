// components/EmptyCardState.jsx
import React from 'react'
import {
  Plus,
  BookOpen,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import AddCardDialog from './AddCardDialog'

const EmptyCardState = ({
  isFirstDialogOpen,
  isSecondDialogOpen,
  setIsFirstDialogOpen,
  setIsSecondDialogOpen,
  newCardData,
  setNewCardData,
  addWordPair,
  removeWordPair,
  toggleWordLearned,
  handleFirstDialogSubmit,
  handleSecondDialogSubmit,
  handleEnterKeyPress,
  isEditing,
}) => {
  return (
    <div
      className="
      flex flex-col items-center justify-center 
      py-4 sm:py-6 lg:py-8 
      px-4 sm:px-6 lg:px-8 
      text-center
      min-h-[85vh] sm:min-h-[90vh] lg:min-h-[85vh]
      w-full
      max-h-screen
      overflow-hidden
    "
    >
      <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        {/* Main Content Card */}
        <div
          className="
          relative
          rounded-xl sm:rounded-2xl lg:rounded-3xl
          bg-white 
          shadow-xl shadow-primary-100/40
          border border-primary-100
          bg-gradient-to-br from-white via-primary-25 to-accent-50/40
          backdrop-blur-sm
          overflow-hidden
          group
          hover:shadow-2xl hover:shadow-primary-200/50
          transition-all duration-300
          transform hover:scale-[1.02]
          w-full
        "
        >
          {/* Decorative Elements - Reduced and repositioned */}
          <div
            className="
            absolute -top-10 -right-10 
            w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64
            bg-gradient-to-br from-accent-200/20 to-primary-200/20
            rounded-full 
            blur-2xl
            group-hover:scale-105
            transition-transform duration-500
          "
          ></div>

          <div
            className="
            absolute -bottom-8 -left-8 
            w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56
            bg-gradient-to-tr from-primary-200/15 to-accent-200/15
            rounded-full 
            blur-xl
            group-hover:scale-105
            transition-transform duration-500
          "
          ></div>

          <div className="relative z-10 p-4 sm:p-6 lg:p-8 xl:p-10">
            {/* Icon Section - Reduced size */}
            <div className="mb-4 sm:mb-6 lg:mb-8 flex justify-center">
              <div
                className="
                relative
                w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24
                bg-gradient-to-br from-accent-100 to-primary-200
                rounded-2xl sm:rounded-3xl
                flex items-center justify-center
                shadow-lg shadow-primary-200/30
                border-2 border-white/80
                group-hover:rotate-2
                transition-all duration-300
              "
              >
                <div
                  className="
                  absolute inset-0 rounded-2xl sm:rounded-3xl
                  bg-gradient-to-br from-accent-400/10 to-primary-400/10
                  animate-pulse
                  group-hover:animate-none
                "
                ></div>

                <BookOpen
                  className="
                  w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12
                  text-primary-600
                  relative z-10
                  drop-shadow-sm
                  group-hover:scale-110
                  transition-transform duration-300
                "
                />

                <Sparkles
                  className="
                  absolute -top-2 -right-2 sm:-top-3 sm:-right-3
                  w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6
                  text-accent-500
                  animate-pulse
                "
                />
              </div>
            </div>

            {/* Text Content - Reduced spacing and font sizes */}
            <div className="mb-6 sm:mb-8 lg:mb-10 space-y-3 sm:space-y-4 lg:space-y-6">
              <h2
                className="
                text-xl sm:text-2xl lg:text-3xl xl:text-4xl
                font-bold 
                text-primary-800
                leading-tight
                tracking-tight
              "
              >
                Mulai Perjalanan Belajar
              </h2>

              <div
                className="
                w-16 sm:w-20 lg:w-24
                h-1 sm:h-1.5 lg:h-2
                bg-gradient-to-r from-accent-400 to-primary-500
                rounded-full 
                mx-auto
              "
              ></div>

              <p
                className="
                text-sm sm:text-base lg:text-lg xl:text-xl
                text-primary-600
                leading-relaxed
                max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto
                font-medium
              "
              >
                Belum ada kartu pembelajaran. Buat kartu pertama Anda dan mulai
                <span className="text-accent-600 font-semibold">
                  {' '}
                  memperluas kosakata
                </span>{' '}
                dengan cara yang menyenangkan!
              </p>
            </div>

            {/* Features Preview - Reduced size and spacing */}
            <div
              className="
              mb-6 sm:mb-8 lg:mb-10
              grid grid-cols-1 sm:grid-cols-3 
              gap-3 sm:gap-4 lg:gap-6
              text-center
              max-w-lg sm:max-w-2xl lg:max-w-3xl mx-auto
            "
            >
              <div
                className="
                p-3 sm:p-4 lg:p-5
                bg-gradient-to-br from-success-50 to-success-100/80
                rounded-xl lg:rounded-2xl
                border border-success-200/50
                group/feature
                hover:shadow-md
                transition-all duration-300
              "
              >
                <GraduationCap
                  className="
                  w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                  text-success-600 
                  mx-auto mb-2 lg:mb-3
                  group-hover/feature:scale-110
                  transition-transform duration-300
                "
                />
                <p
                  className="
                  text-xs sm:text-sm lg:text-base
                  font-semibold text-success-700
                "
                >
                  Belajar Efektif
                </p>
              </div>

              <div
                className="
                p-3 sm:p-4 lg:p-5
                bg-gradient-to-br from-accent-50 to-accent-100/80
                rounded-xl lg:rounded-2xl
                border border-accent-200/50
                group/feature
                hover:shadow-md
                transition-all duration-300
              "
              >
                <Sparkles
                  className="
                  w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                  text-accent-600 
                  mx-auto mb-2 lg:mb-3
                  group-hover/feature:scale-110 group-hover/feature:rotate-12
                  transition-all duration-300
                "
                />
                <p
                  className="
                  text-xs sm:text-sm lg:text-base
                  font-semibold text-accent-700
                "
                >
                  Interaktif
                </p>
              </div>

              <div
                className="
                p-3 sm:p-4 lg:p-5
                bg-gradient-to-br from-primary-50 to-primary-100/80
                rounded-xl lg:rounded-2xl
                border border-primary-200/50
                group/feature
                hover:shadow-md
                transition-all duration-300
              "
              >
                <ArrowRight
                  className="
                  w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                  text-primary-600 
                  mx-auto mb-2 lg:mb-3
                  group-hover/feature:scale-110 group-hover/feature:translate-x-1
                  transition-all duration-300
                "
                />
                <p
                  className="
                  text-xs sm:text-sm lg:text-base
                  font-semibold text-primary-700
                "
                >
                  Progresif
                </p>
              </div>
            </div>

            {/* CTA Button - Reduced size */}
            <AddCardDialog
              isFirstDialogOpen={isFirstDialogOpen}
              isSecondDialogOpen={isSecondDialogOpen}
              setIsFirstDialogOpen={setIsFirstDialogOpen}
              setIsSecondDialogOpen={setIsSecondDialogOpen}
              newCardData={newCardData}
              setNewCardData={setNewCardData}
              addWordPair={addWordPair}
              removeWordPair={removeWordPair}
              toggleWordLearned={toggleWordLearned}
              handleFirstDialogSubmit={handleFirstDialogSubmit}
              handleSecondDialogSubmit={handleSecondDialogSubmit}
              handleEnterKeyPress={handleEnterKeyPress}
              isEditing={isEditing}
            >
              <Button
                className="
                w-full sm:w-auto sm:min-w-[200px] lg:min-w-[240px]
                px-6 sm:px-8 lg:px-12
                py-3 sm:py-4 lg:py-5
                text-base sm:text-lg lg:text-xl
                font-bold
                bg-gradient-to-r from-accent-500 via-accent-600 to-primary-600
                hover:from-accent-600 hover:via-accent-700 hover:to-primary-700
                active:from-accent-700 active:via-accent-800 active:to-primary-800
                text-white 
                shadow-xl shadow-accent-200/50
                hover:shadow-2xl hover:shadow-accent-300/60
                rounded-xl lg:rounded-2xl
                border border-accent-400/30
                hover:border-accent-500/50
                transition-all duration-300
                transform hover:scale-105 active:scale-95
                group/button
                relative
                overflow-hidden
              "
              >
                {/* Button Shine Effect */}
                <div
                  className="
                  absolute inset-0 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                  -translate-x-full group-hover/button:translate-x-full
                  transition-transform duration-500
                "
                ></div>

                <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 relative z-10">
                  <Plus
                    className="
                    w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7
                    group-hover/button:rotate-90
                    transition-transform duration-300
                  "
                  />
                  <span>Buat Kartu Pertama</span>
                  <ArrowRight
                    className="
                    w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6
                    group-hover/button:translate-x-1
                    transition-transform duration-300
                  "
                  />
                </div>
              </Button>
            </AddCardDialog>

            {/* Helper Text - Reduced size */}
            <p
              className="
              mt-4 sm:mt-6 lg:mt-8
              text-xs sm:text-sm lg:text-base
              text-primary-500
              font-medium
            "
            >
              💡 Tip: Mulai dengan kata-kata yang sering Anda gunakan
              sehari-hari
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyCardState
